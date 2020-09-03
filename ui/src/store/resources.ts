import { types, getEnv, flow, Instance, getSnapshot } from "mobx-state-tree";
import { Api } from "../api";
import { ICategoryStore, Tag } from "./category";
import { IKindStore } from "./kind";
import { ICatalogStore } from "./catalog";
import fuzzysort from "fuzzysort";

const Catalog = types.model("Catalog", {
  id: types.number,
  type: types.string
});

const ResourceVersion = types.model("Version", {
  id: types.number,
  version: types.optional(types.string, "0.1"),
  displayName: types.string,
  description: types.string,
  minPipelinesVersion: types.optional(types.string, ""),
  rawURL: types.string,
  webURL: types.string,
  updatedAt: types.string
});

export const Resource = types.model("Resource", {
  id: types.number,
  kind: types.string,
  name: types.string,
  catalog: Catalog,
  latestVersion: ResourceVersion,
  tags: types.optional(types.array(Tag), []),
  rating: types.optional(types.number, 0)
});

export type IResource = Instance<typeof Resource>;

export const ResourceStore = types
  .model("ResourceStore", {
    resources: types.array(Resource),
    isLoading: true,
    searchText: types.optional(types.string, ""),
    err: ""
  })

  .views(self => ({
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
    get count() {
      return self.resources.length;
    },
    get searchedText() {
      const { searchText } = self;
      return searchText;
    },
    get resourceList() {
      const { resources } = self;
      return resources;
    }
  }))

  .actions(self => ({
    add(item: any) {
      self.resources.push(item);
    },
    setLoading(l: boolean) {
      self.isLoading = l;
    },
    setSearchText(text: string) {
      self.searchText = text;
    }
  }))

  .actions(self => ({
    load: flow(function*() {
      const catalogItem: any = new Set();
      const kindItem: any = new Set();
      try {
        self.setLoading(true);

        const { api } = self;

        const json = yield api.resources();
        json.data.forEach((item: IResource) => {
          self.add(item);
          catalogItem.add(item.catalog.type);
          kindItem.add(item.kind);
        });

        [...kindItem].forEach((kindName: string) => {
          self.kindStore.add({ name: kindName });
          // console.log("00", getSnapshot(self.kindStore.list));
        });

        [...catalogItem].forEach((catalogName: string) => {
          self.catalogStore.add({ name: catalogName });
          // console.log("11", getSnapshot(self.catalogStore.list));
        });
      } catch (err) {
        self.err = err.toString();
      }
      self.setLoading(false);
    })
  }))

  .views(self => ({
    get list() {

      const { resources } = self;
      const { searchText } = self;

      const kind = new Set(self.kindStore.selectedkind);
      const tag = new Set(self.categoryStore.tags);
      const catalog = new Set(self.catalogStore.selectedCatalogType);

      let filterResources = getSnapshot(resources).filter((r: any) =>
        tag.size > 0
          ? r.tags.some((t: any) => tag.has(t.name))
          : true && catalog.size > 0
          ? catalog.has(r.catalog.type)
          : true && kind.size > 0
          ? kind.has(r.kind)
          : true
      );
      return searchText !== ""
        ? fuzzysort
            .go(searchText, filterResources, {
              keys: ["name", "displayName"]
            })
            .map((resource: any) => resource.obj)
        : filterResources;
    }
  }))
  .actions(self => ({
    afterCreate() {
      self.load();
    }
  }));
