import { types, Instance, getSnapshot } from 'mobx-state-tree';
import { CategoryStore, ICategoryStore, Tag } from './category';
import { flow, getEnv } from 'mobx-state-tree';
import { Api } from '../api';
import fuzzysort from 'fuzzysort';
import { Catalog, ICatalogStore } from './catalog';
import { store } from '..';

// export const Catalog = types
//   .model({
//     id: types.identifierNumber,
//     name: types.optional(types.string, ''),
//     type: types.optional(types.string, ''),
//     selected: false
//   })
//   .actions((self) => ({
//     toggle() {
//       self.selected = !self.selected;
//     }
//   }));

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

const VersionInfo = types.model({
  id: types.identifierNumber,
  version: types.string,
  displayName: types.string,
  description: types.string,
  minPipelinesVersion: types.string,
  rawURL: types.string,
  webURL: types.string,
  updatedAt: types.string
  // resource: types.late(() => types.reference(Resource))
});

export const Resource = types.model({
  id: types.identifierNumber,
  name: types.optional(types.string, ''),
  catalog: types.reference(Catalog),
  kind: types.reference(kind),
  latestVersion: types.reference(VersionInfo),
  tags: types.array(types.reference(Tag)), // ["1", "2"]
  rating: types.number,
  versions: types.map(VersionInfo)
});

export type IKind = Instance<typeof kind>;
export type ICatalog = Instance<typeof Catalog>;
export type IResource = Instance<typeof Resource>;

export const RootStore = types
  .model({
    resources: types.map(Resource),
    versions: types.map(VersionInfo),
    kind: types.map(kind),
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
      self.kind.forEach((c: any) => {
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
    //   self.catalog.put(item);
    // },

    addKind(item: string) {
      self.kind.put({ name: item });
    },

    addVersionInfo(item: any) {
      self.versions.put(item);
    }
  }))
  .actions((self) => ({
    load: flow(function* () {
      try {
        self.setLoading(true);

        const { api } = self;
        const json = yield api.resources();

        json.data.forEach((item: any) => {
          for (let i = 0; i < item.tags.length; i++) {
            item.tags[i] = item.tags[i].id;
          }
          self.addKind(item.kind);
          // console.log(self.catalogStore);

          self.catalogStore.addcatalog(item.catalog);
          item.catalog = item.catalog.id;

          self.versions.put(item.latestVersion);
          item.latestVersion = item.latestVersion.id;
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

      const catalogList = new Set(self.catalogStore.selectedCatalog);
      const kindList = new Set(self.selectedKind);
      const tagList = new Set(self.categoryStore.tag);

      const filtered: any = [];
      resources.forEach((r: any) => {
        console.log(r.catalog);
        // console.log(catalogList.has(r.catalog));
        // if (
        //   (kindList.size > 0 ? kindList.has(r.kind.name) : true) &&
        //   (catalogList.size > 0 ? catalogList.has(r.catalog.id) : true) &&
        //   (tagList.size > 0
        //     ? Array.from(getSnapshot(r.tags)).some((x: any) => {
        //         return tagList.has(x);
        //       })
        //     : true)
        // ) {
        //   filtered.push(getSnapshot(r));
        // }
      });

      if (search !== '') {
        return fuzzysort
          .go(search, filtered, {
            keys: ['name']
          })
          .map((resource: any) => resource.obj);
      }
      return filtered;
    }
  }));
