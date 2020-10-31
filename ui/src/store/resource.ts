import { types, Instance, SnapshotIn, SnapshotOut, IType, getSnapshot } from 'mobx-state-tree';
import fuzzysort from 'fuzzysort';
import moment, { Moment } from 'moment';
import { flow, getEnv } from 'mobx-state-tree';
import { Tag, ICategoryStore, ITag } from './category';
import { Api } from '../api';
import { Catalog, ICatalogStore, ICatalog } from './catalog';
import { Kind, IKindStore, IKind } from './kind';

export const CustomDate = types.custom<string, Moment>({
  name: 'momentDate',
  fromSnapshot(value: string): Moment {
    return moment(new Date(value));
  },
  toSnapshot(value: Moment): string {
    return value.fromNow();
  },
  isTargetType(v: string) {
    return moment.isMoment(v);
  },
  getValidationMessage(v: string) {
    if (moment.isMoment(v)) {
      return 'Invalid moment object';
    }
    return '';
  }
});

const VersionInfo_A = types.model({
  id: types.identifierNumber,
  version: types.string,
  displayName: types.string,
  description: types.string,
  minPipelinesVersion: types.string,
  rawURL: types.string,
  webURL: types.string,
  updatedAt: CustomDate
});

/**
 * IVersionInfo will inherit the properties of VersionInfo_A
 */
export interface IVersionInfo extends Instance<typeof VersionInfo_A> {
  resource: IResource;
}

/**
 * Interface which is what we can pass to Model.create
 */

export interface IVersionInfoSnapshotIn extends SnapshotIn<typeof VersionInfo_A> {
  resource: string | number;
}

/**
 * Interface for snapshot of the model which we get as output
 */
export interface IVersionInfoSnapshotOut extends SnapshotOut<typeof VersionInfo_A> {
  resource: string | number;
}

export type IVersionInfoRunType = IType<
  IVersionInfoSnapshotIn,
  IVersionInfoSnapshotOut,
  IVersionInfo
>;

/**
 * .props(props) produces a new type, based on the current one, and adds / overrides the specified properties
 */
export const VersionInfo: IVersionInfoRunType = VersionInfo_A.props({
  resource: types.reference(types.late(() => Resource))
});

const Resource_A = types.model({
  id: types.identifierNumber,
  name: types.optional(types.string, ''),
  catalog: types.reference(Catalog),
  kind: types.reference(Kind),
  tags: types.array(types.reference(Tag)), // ["1", "2"]
  rating: types.number,
  versions: types.array(types.reference(VersionInfo)),
  displayName: ''
});

export interface IResource extends Instance<typeof Resource_A> {
  latestVersion: IVersionInfo;
}

export interface IResourceSnapshotIn extends SnapshotIn<typeof Resource_A> {
  latestVersion: string | number;
}

export interface IResourceSnapshotOut extends SnapshotOut<typeof Resource_A> {
  latestVersion: string | number;
}

export type IResourceRunType = IType<IResourceSnapshotIn, IResourceSnapshotOut, IResource>;

export const Resource: IResourceRunType = Resource_A.props({
  latestVersion: types.reference(types.late(() => VersionInfo))
});

export const RootStore = types
  .model({
    resources: types.map(Resource),
    versions: types.map(VersionInfo),
    catalog: types.map(Catalog),
    kind: types.map(Kind),
    search: '',
    err: '',
    isLoading: true
  })
  .views((self) => ({
    get api(): Api {
      return getEnv(self).api;
    },
    get categoryStore(): ICategoryStore {
      return getEnv(self).categoryStore;
    },
    get catalogStore(): ICatalogStore {
      return getEnv(self).catalogStore;
    },
    get kindStore(): IKindStore {
      return getEnv(self).kindStore;
    },
    get selectedKind() {
      const list: Array<string> = [];
      self.kind.forEach((c: IKind) => {
        if (c.selected) {
          list.push(c.name);
        }
      });
      return list;
    }
  }))
  .actions((self) => ({
    setLoading(l: boolean) {
      self.isLoading = l;
    },
    setSearch(text: string) {
      self.search = text;
    },
    addResources(item: IResource) {
      self.resources.put(item);
    },
    addCatalog(item: ICatalog) {
      self.catalog.put(item);
    },
    addKind(item: string) {
      self.kind.put({ name: item });
    },
    addVersionInfo(item: IVersionInfo) {
      self.versions.put(item);
    }
  }))
  .actions((self) => ({
    load: flow(function* () {
      try {
        self.setLoading(true);
        const { api } = self;
        const json = yield api.resources();

        const kind: string[] = json.data.map((r: IResource) => r.kind);
        kind.forEach((k: string) => {
          self.addKind(k);
          self.kindStore.add(k);
        });

        json.data.forEach((r: IResource) => {
          self.addCatalog(r.catalog);
          self.catalogStore.add(r.catalog);
        });

        json.data.forEach((item: any) => {
          item.latestVersion.resource = item.id;
          self.versions.put(item.latestVersion);
        });

        const resources: IResource[] = json.data.map((r: IResource) => ({
          id: r.id,
          name: r.name,
          catalog: r.catalog.id,
          kind: r.kind,
          latestVersion: r.latestVersion.id,
          tags: r.tags.map((tag: ITag) => tag.id),
          rating: r.rating,
          versions: [],
          displayName: r.latestVersion.displayName
        }));

        resources.forEach((r: IResource) => {
          r.versions.push(r.latestVersion);
          self.addResources(r);
        });
      } catch (err) {
        self.err = err.toString();
      }
      self.setLoading(false);
    })
  }))
  .actions((self) => ({
    afterCreate() {
      self.load();
    }
  }))

  .views((self) => ({
    get filteredResources() {
      const { resources, search } = self;
      const filtered: IResource[] = [];
      const kindList = new Set(self.kindStore.selected);
      const catalogList = new Set(self.catalogStore.selected);
      const tagList = new Set(self.categoryStore.tag);

      resources.forEach((r: IResource) => {
        // console.log(r.catalog); -----> This gives an invalid reference error if catalog is not added in the root store
        if (
          (kindList.size > 0 ? kindList.has(r.kind.name) : true) &&
          (catalogList.size > 0 ? catalogList.has(r.catalog.id) : true) &&
          (tagList.size > 0
            ? Array.from(getSnapshot(r.tags)).some((t: number | string) => {
                return tagList.has(t as number);
              })
            : true)
        )
          filtered.push(r);
      });
      if (search !== '') {
        return fuzzysort
          .go(search, filtered, {
            keys: ['name', 'displayName']
          })
          .map((resource: Fuzzysort.KeysResult<IResource>) => resource.obj);
      }
      return filtered;
    }
  }));
