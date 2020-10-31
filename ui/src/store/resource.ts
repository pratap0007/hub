import { types, Instance, getSnapshot } from 'mobx-state-tree';
import fuzzysort from 'fuzzysort';
import moment, { Moment } from 'moment';
import { flow, getEnv } from 'mobx-state-tree';
import { Tag, ICategoryStore, ITag } from './category';
import { Api } from '../api';
import { Catalog, CatalogStore } from './catalog';
import { Kind, KindStore } from './kind';

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

const VersionInfo = types.model('VersionInfo', {
  id: types.identifierNumber,
  version: types.string,
  displayName: types.string,
  description: types.string,
  minPipelinesVersion: types.string,
  rawURL: types.string,
  webURL: types.string,
  updatedAt: CustomDate
});

export const Resource = types.model('Resource', {
  id: types.identifierNumber,
  name: types.optional(types.string, ''),
  catalog: types.reference(Catalog),
  kind: types.reference(Kind),
  latestVersion: types.reference(VersionInfo),
  tags: types.array(types.reference(Tag)), // ["1", "2"]
  rating: types.number,
  versions: types.array(types.reference(VersionInfo)),
  displayName: ''
});

export type IResource = Instance<typeof Resource>;
export type IResourceStore = Instance<typeof ResourceStore>;
export type IVersionInfo = Instance<typeof VersionInfo>;

export const ResourceStore = types
  .model('ResourceStore', {
    list: types.map(Resource),
    catalog: CatalogStore,
    kind: KindStore,
    versions: types.map(VersionInfo),
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
    }
  }))
  .actions((self) => ({
    setLoading(l: boolean) {
      self.isLoading = l;
    },
    setSearch(text: string) {
      self.search = text;
    },
    add(item: IResource) {
      self.list.put(item);
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
          self.kind.add(k);
        });

        json.data.forEach((r: IResource) => {
          self.catalog.add(r.catalog);
        });

        json.data.forEach((item: IResource) => {
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
          self.add(r);
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
      const { list, search } = self;
      const filtered: IResource[] = [];
      const kindList = new Set(self.kind.selected);
      const catalogList = new Set(self.catalog.selected);
      const tagList = new Set(self.categoryStore.tag);

      list.forEach((r: IResource) => {
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
