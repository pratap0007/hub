import { types, flow, getEnv, Instance } from "mobx-state-tree";
import { values } from "mobx";
import { Api } from "../api";

const Catalog = types.model("Catalog", {
  id: types.optional(types.number, 0),
  type: types.optional(types.string, "")
});

export const Tag = types.model("Tag", {
  id: types.optional(types.number, 0),
  name: types.optional(types.string, " ")
});

export const LatestVersion = types.model("Version", {
  id: types.number,
  version: types.optional(types.string, "0.1"),
  displayName: types.string,
  description: types.string,
  minPipelinesVersion: types.optional(types.string, ""),
  rawURL: types.string,
  webURL: types.string,
  updatedAt: types.string
});

export const ResourceItem = types.model("ResourceItem", {
  id: types.number,
  type: types.string,
  name: types.string,
  catalog: Catalog,
  latestVersion: LatestVersion,
  tags: types.optional(types.array(Tag), []),
  rating: types.optional(types.number, 0)
});

export type IResourceItem = Instance<typeof ResourceItem>;

export const Resources = types
  .model("Resources", {
    resourceList: types.optional(types.array(ResourceItem), []),
    isLoading: types.optional(types.boolean, true),
    err: types.optional(types.string, "")
  })
  .views(self => ({
    get api(): Api {
      return getEnv(self).api;
    },

    get count() {
      return self.resourceList.length;
    },
    get resouresData() {
      return self.resourceList;
    },
    get resourcesSortByName() {
      return sortByName(values(self.resourceList));
    },
    get resourcesSortByRating() {
      return sortByRating(values(self.resourceList));
    }
  }))
  .actions(self => ({
    add(item: IResourceItem) {
      self.resourceList.push(item);
    },
    setLoading(status: boolean) {
      self.isLoading = status;
    }
  }))
  .actions(self => ({
    loadResources: flow(function* load() {
      try {
        self.setLoading(true);
        const { api } = self;
        const resources = yield api.resources();
        resources.forEach((item: IResourceItem) => {
          self.add(item);
        });
      } catch (error) {
        console.error("Failed to fetch resources", error);
        self.err = error.toString();
      }
      self.setLoading(false);
    })
  }))
  .actions(self => ({
    afterCreate() {
      self.loadResources();
    }
  }));

const sortByName = (resources: any) => {
  if (resources.length === 0) {
    return resources;
  }
  return resources.sort((resourceA: any, resourceB: any) =>
    resourceA.name > resourceB.name
      ? 1
      : resourceA.name === resourceB.name
      ? 0
      : -1
  );
};

const sortByRating = (resources: any) => {
  if (resources.length === 0) {
    return resources;
  }
  return resources.sort((resourceA: any, resourceB: any) =>
    resourceA.rating < resourceB.rating
      ? 1
      : resourceA.rating === resourceB.rating
      ? 0
      : -1
  );
};
