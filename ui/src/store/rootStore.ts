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
    resourcestore: types.optional(ResourceStore, {}),
    resourcekindstore: types.optional(KindStore, {}),
    catalogtypestore: types.optional(CatalogStore, {}),
    categorystore: types.optional(CategoryStore, {}),
    dashboardresource: types.optional(types.array(Resource), []),
    searchstore: types.optional(SearchStore, {})
  })
  .views(self => ({
    get alldashboardresource() {
      const { resources } = self.resourcestore;
      const { filteredTags } = self.categorystore;
      const { catalogType } = self.catalogtypestore;
      const { resourceKind } = self.resourcekindstore;
      const { searchtext } = self.searchstore;

      return filterResourceByAllFilter(
        resources,
        filteredTags,
        catalogType,
        resourceKind,
        searchtext
      );
    }
  }))

  .actions(self => ({
    afterCreate() {
      self.resourcestore.loadResources();
      self.categorystore.loadCategories();
    }
  }));

const filterResourceByAllFilter = (
  resources: any,
  filteredTags: any,
  catalogType: any,
  resourceKind: any,
  searchtext: any
) => {
  let filterresult = resources;
  if (resourceKind.length > 0) {
    let tempfilterresult: any = [];
    resourceKind.forEach((kind: any) => {
      filterresult.forEach((resource: any) => {
        if (resource.type === kind) {
          tempfilterresult.push(resource);
        }
      });
    });
    filterresult = tempfilterresult;
  }
  if (catalogType.length > 0) {
    let tempfilterresult: any = [];
    catalogType.forEach((catalogtype: any) => {
      filterresult.forEach((resource: any) => {
        if (resource.catalog.type === catalogtype) {
          tempfilterresult.push(resource);
        }
      });
    });
    filterresult = tempfilterresult;
  }
  if (filteredTags.length > 0) {
    let tempfilterresult: any = [];
    filteredTags.forEach((tag: any) => {
      filterresult.forEach((r: any) => {
        r.tags.forEach((t: any) => {
          if (t.name === tag) {
            tempfilterresult.push(r);
          }
        });
      });
    });
    filterresult = tempfilterresult;
  }
  if (searchtext !== "") {
    const tempfilterresult = fuzzysort.go(searchtext, filterresult, {
      keys: ["name", "displayName"]
    });
    filterresult = tempfilterresult.map((resource: any) => resource.obj);
  }
  return filterresult;
};
