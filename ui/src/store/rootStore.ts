import { types } from "mobx-state-tree";
import { ResourceStore } from "./resources";
// import { KindStore } from "./kind";
// import { CatalogStore } from "./catalog";
// import { CategoryStore } from "./category";
export const RootStore = types.model("RootStore", {
  resourceStore: types.optional(ResourceStore, {})
});
