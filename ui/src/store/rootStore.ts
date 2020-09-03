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
    resourceStore: types.optional(ResourceStore, {}),
    kindStore: types.optional(KindStore, {}),
    catalogStore: types.optional(CatalogStore, {}),
    categoryStore: types.optional(CategoryStore, {}),
    searchStore: types.optional(SearchStore, {}),
    dashboardResource: types.array(Resource)
  })
  .views(self => ({
    get allDashboardResource() {
      const { resources } = self.resourceStore;
      const { filteredTags } = self.categoryStore;
      const { catalogList } = self.catalogStore;
      const { kindList } = self.kindStore;
      const { searchText } = self.searchStore;

      return filterResourceByAllFilter(
        resources,
        filteredTags,
        catalogList,
        kindList,
        searchText
      );
    }
  }))
  .actions(self => ({
    afterCreate() {
      self.resourceStore.load();
      // self.categorystore.load();
    }
  }));

const filterResourceByAllFilter = (
  resources: any,
  filteredTags: any,
  catalogType: any,
  resourceKind: any,
  searchText: any
) => {
  let filterResult = resources;
  if (resourceKind.length > 0) {
    let tempFilterResult: any = [];
    resourceKind.forEach((kind: any) => {
      filterResult.forEach((resource: any) => {
        if (resource.type === kind) {
          tempFilterResult.push(resource);
        }
      });
    });
    filterResult = tempFilterResult;
  }
  if (catalogType.length > 0) {
    let tempFilterResult: any = [];
    catalogType.forEach((catalogtype: any) => {
      filterResult.forEach((resource: any) => {
        if (resource.catalog.type === catalogtype) {
          tempFilterResult.push(resource);
        }
      });
    });
    filterResult = tempFilterResult;
  }
  if (filteredTags.length > 0) {
    let tempFilterResult: any = [];
    filteredTags.forEach((tag: any) => {
      filterResult.forEach((r: any) => {
        r.tags.forEach((t: any) => {
          if (t.name === tag) {
            tempFilterResult.push(r);
          }
        });
      });
    });
    filterResult = tempFilterResult;
  }
  if (searchText !== "") {
    const tempFilterResult = fuzzysort.go(searchText, filterResult, {
      keys: ["name", "displayName"]
    });
    filterResult = tempFilterResult.map((resource: any) => resource.obj);
  }
  return filterResult;
};
