import { types } from "mobx-state-tree";
import fuzzysort from "fuzzysort";
import { ResourceStore } from "./resources";
import { KindStore } from "./kind";
import { CatalogStore } from "./catalog";
import { CategoryStore } from "./category";
import { Resource } from "./resources";
import { SearchStore } from "./search";

export const RootStore = types
  .model("RootStore", {
    resourceStore: types.optional(ResourceStore, ResourceStore.create({}, {
      kindStore: KindStore.create({}),
      categoryStore: KindStore.create({}),
      catalogStore: CatalogStore.create({}),
    }))
  })
  .views(self => ({
    //get allDashboardResource() {
      //const { resources } = self.resourceStore;
      //const { filteredTags } = self.categoryStore;
      //const { catalogList } = self.catalogStore;
      //const { kindList } = self.kindStore;
      //const { searchText } = self.searchStore;

      //return filterResourceByAllFilter(
        //resources,
        //filteredTags,
        //catalogList,
        //kindList,
        //searchText
      //);
    //}
  }))
  .actions(self => ({
    //afterCreate() {
      ////self.resourceStore.load();
      //// self.categorystore.load();
    //}
  }));

