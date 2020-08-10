import { types, getEnv, flow, Instance } from "mobx-state-tree";
import { Api } from "../api";

const Catalog = types.model("Catalog", {
  id: types.number,
  type: types.string
});
const Tag = types.model("Tag", {
  id: types.identifierNumber,
  name: types.string
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

// modal for one resource
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
    err: ""
  })
  .views(self => ({
    get api(): Api {
      return getEnv(self).api;
    },

    get count() {
      return self.resources.length;
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
    loadResources: flow(function*() {
      try {
        self.setLoading(true);
        const { api } = self;
        const json = yield api.resources();
        json.data.forEach((item: IResource) => {
          self.add(item);
        });
      } catch (err) {
        self.err = err.toString();
      }
      self.setLoading(false);
    })
  }));
// .actions(self => ({
//   afterCreate() {
//     self.loadResources();
//   }
// }));
