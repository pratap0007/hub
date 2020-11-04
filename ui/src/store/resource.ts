import {
  types,
  Instance,
  SnapshotIn,
  SnapshotOut,
  IType,
  IMSTArray,
  getSnapshot
} from 'mobx-state-tree';
import { Tag, ICategoryStore } from './category';
import { flow, getEnv } from 'mobx-state-tree';
import { Api } from '../api';
import { Catalog, ICatalogStore } from './catalog';
import fuzzysort from 'fuzzysort';
import { Moment } from 'moment';
import moment from 'moment';

export const kind = types
  .model({
    name: types.identifier,
    selected: false
  })
  .actions((self) => ({
    toggle() {
      self.selected = !self.selected;
    }
  }));

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
export interface IVersionInfo extends Instance<typeof VersionInfo_A> {
  // resource: string | number;
  resource: IResource;
}
export interface IVersionInfoSnapshotIn extends SnapshotIn<typeof VersionInfo_A> {
  resource?: string | number;
}
export interface IVersionInfoSnapshotOut extends SnapshotOut<typeof VersionInfo_A> {
  resource: string | number;
}
export type IVersionInfoRunType = IType<
  IVersionInfoSnapshotIn,
  IVersionInfoSnapshotOut,
  IVersionInfo
>;
export const VersionInfo: IVersionInfoRunType = VersionInfo_A.props({
  resource: types.reference(types.late(() => Resource))
});
const Resource_A = types.model({
  id: types.identifierNumber,
  name: types.optional(types.string, ''),
  catalog: types.reference(Catalog),
  kind: types.reference(kind),
  latestVersion: types.reference(VersionInfo),
  tags: types.array(types.reference(Tag)), // ["1", "2"]
  rating: types.number,
  displayName: ''
});

export interface IResource extends Instance<typeof Resource_A> {
  versions: IMSTArray<IVersionInfoRunType>;
}
export interface IResourceSnapshotIn extends SnapshotIn<typeof Resource_A> {
  versions?: IVersionInfoSnapshotIn[];
}
export interface IResourceSnapshotOut extends SnapshotOut<typeof Resource_A> {
  versions: IVersionInfoSnapshotOut[];
}
export type IResourceoRunType = IType<IResourceSnapshotIn, IResourceSnapshotOut, IResource>;
export const Resource: IResourceoRunType = Resource_A.props({
  versions: types.array(types.late(() => VersionInfo))
});
export type IKind = Instance<typeof kind>;
export type ICatalog = Instance<typeof Catalog>;

export const RootStore = types
  .model({
    resources: types.map(Resource),
    versions: types.map(VersionInfo),
    kind: types.map(kind),
    catalog: types.map(Catalog),
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
    get selectedKind() {
      let list: Array<string> = [];
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
    // addCatalog(item: ICatalog) {
    //   // item.id = String(item.id);
    //   self.catalogStore.list.put(item);
    // },
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
        json.data.forEach((item: IResource) => {
          for (let i = 0; i < item.tags.length; i++) {
            item.tags[i] = item.tags[i].id as any;
          }
          self.addKind(item.kind as any);

          item.displayName = item.latestVersion.displayName;
          self.catalogStore.addcatalog(item.catalog);
          item.catalog = item.catalog.id as any;
          item.latestVersion.resource = item.id as any;
          self.versions.put(item.latestVersion);
          item.latestVersion = item.latestVersion.id as any;
          item.versions = [] as any;
          self.addResources(item);
        });
      } catch (err) {
        console.log(err);
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

      // const catalogList = new Set(self.catalogStore.selectedCatalog);
      const kindList = new Set(self.selectedKind);
      const tagList = new Set(self.categoryStore.tag);

      const filtered: Array<IResource> = [];
      resources.forEach((r: any) => {
        if (
          (kindList.size > 0 ? kindList.has(r.kind.name) : true) &&
          (tagList.size > 0
            ? Array.from(getSnapshot(r.tags)).some((x: any) => {
                return tagList.has(x);
              })
            : true)
        ) {
          filtered.push(getSnapshot(r));
        }
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
