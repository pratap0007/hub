import { types, getEnv, flow, Instance } from 'mobx-state-tree';
import fuzzysort from 'fuzzysort';
import { Api } from '../api';
import { ICategoryStore, Tag, ITag } from './category';
import { IKindStore, Kind } from './kind';
import { ICatalogStore, CatalogType } from './catalog';

const Catalog = types.model('Catalog', {
  id: types.number,
  type: types.string
});

const ResourceVersion = types.model('Version', {
  id: types.number,
  version: types.optional(types.string, '0.1'),
  displayName: types.string,
  description: types.string,
  minPipelinesVersion: types.optional(types.string, ''),
  rawURL: types.string,
  webURL: types.string,
  updatedAt: types.string
});

export const Resource = types.model('Resource', {
  id: types.number,
  kind: types.string,
  name: types.string,
  catalog: Catalog,
  latestVersion: ResourceVersion,
  tags: types.optional(types.array(Tag), []),
  rating: 0
});

export type IResource = Instance<typeof Resource>;
export type IResourceStore = Instance<typeof ResourceStore>;

export const ResourceStore = types
  .model('ResourceStore', {
    resources: types.array(Resource),
    isLoading: true,
    searchInput: types.optional(types.string, ''),
    err: ''
  })

  .views((self) => ({
    get api(): Api {
      return getEnv(self).api;
    },
    get kindStore(): IKindStore {
      return getEnv(self).kindStore;
    },
    get catalogStore(): ICatalogStore {
      return getEnv(self).catalogStore;
    },
    get categoryStore(): ICategoryStore {
      return getEnv(self).categoryStore;
    },
    get count(): number {
      return self.resources.length;
    },
    get resourceList(): Array<IResource> {
      const { resources } = self;
      return resources;
    }
  }))

  .actions((self) => ({
    add(item: IResource) {
      self.resources.push(item);
    },
    setLoading(l: boolean) {
      self.isLoading = l;
    },
    setSearchInput(text: string) {
      self.searchInput = text;
    }
  }))

  .actions((self) => ({
    load: flow(function* () {
      try {
        self.setLoading(true);

        const catalogData = new Set();
        const kindData = new Set();

        const { api } = self;
        const json = yield api.resources();

        json.data.forEach((item: IResource) => {
          self.add(item);
          catalogData.add(item.catalog.type);
          kindData.add(item.kind);
        });

        Array.from(kindData).forEach((kindName, index) => {
          self.kindStore.add(Kind.create({ id: index, name: kindName as string }));
        });

        Array.from(catalogData).forEach((catalogName, index) => {
          self.catalogStore.add(CatalogType.create({ id: index, name: catalogName as string }));
        });
      } catch (err) {
        self.err = err.toString();
      }
      self.setLoading(false);
    })
  }))

  .views((self) => ({
    get list(): Array<IResource> {
      const { resources } = self;
      const { searchInput } = self;

      const kind = new Set(self.kindStore.kinds);
      const tag = new Set(self.categoryStore.tags);
      const catalog = new Set(self.catalogStore.catalogs);

      const filterResources = resources.filter(
        (r: IResource) =>
          (tag.size > 0 ? r.tags.some((t: ITag) => tag.has(t.name)) : true) &&
          (catalog.size > 0 ? catalog.has(r.catalog.type) : true) &&
          (kind.size > 0 ? kind.has(r.kind) : true)
      );

      return searchInput !== ''
        ? fuzzysort
            .go(searchInput, filterResources, {
              keys: ['name', 'displayName']
            })
            .map((resource: Fuzzysort.KeysResult<IResource>) => resource.obj)
        : filterResources;
    }
  }))

  .actions((self) => ({
    afterCreate() {
      self.load();
    }
  }));
