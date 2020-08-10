import { types, getEnv, flow, Instance, getSnapshot } from "mobx-state-tree";
import { Api } from "../api";
import { Tag } from "./category";
import { KindStore } from "./kind";
import { CatalogStore } from "./catalog";

const Catalog = types.model("Catalog", {
  id: types.number,
  type: types.string
});

const LatestVersion = types.model("Version", {
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
  type: types.string,
  name: types.string,
  catalog: Catalog,
  latestVersion: LatestVersion,
  tags: types.optional(types.array(Tag), []),
  rating: types.optional(types.number, 0)
});

export type IResource = Instance<typeof Resource>;

export const ResourceStore = types
  .model("ResourceStore", {
    resources: types.array(Resource),
    isLoading: true,
    kindStore: types.optional(KindStore, {}),
    catalogStore: types.optional(CatalogStore, {}),
    err: ""
  })

  .views(self => ({
    get api(): Api {
      return getEnv(self).api;
    },
    get count() {
      return self.resources.length;
    },
    get list() {
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
          kindItem.add(item.type);
        });
        [...kindItem].forEach((kindName: string) => {
          self.kindStore.add({ name: kindName });
          // console.log("11", getSnapshot(self.kindStore.list));
        });
        [...catalogItem].forEach((catalogName: string) => {
          self.catalogStore.add({ name: catalogName });
          // console.log("22", getSnapshot(self.catalogStore.list));
        });
      } catch (err) {
        self.err = err.toString();
      }
      self.setLoading(false);
    })
  }))
  .actions(self => ({
    afterCreate() {
      // self.load();
      // self.categorystore.load();
    }
  }));
