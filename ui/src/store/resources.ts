import { types, getEnv, flow, Instance, getSnapshot } from "mobx-state-tree";
import { Api } from "../api";
import { ICategoryStore, Tag } from "./category";
import { IKindStore } from "./kind";
import { ICatalogStore } from "./catalog";


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
  .views(self => ({
    get list() {
      const { resources } = self;

      const kinds = new Set(self.kindStore.list.map(x => x.name))
      const tags = new Set(self.categoryStore.tags)
      const catalogs = new Set(self.catalogStore.list)

      return resources.filter(r => {
         r.tags.some(t => tags.has(t)) && catalogs.has(r.catalog.type) && kinds.has(r.kind)
      })

      //if (searchText !== "") {
        //const tempFilterResult = fuzzysort.go(searchText, filterResult, {
          //keys: ["name", "displayName"]
        //});
        //filterResult = tempFilterResult.map((resource: any) => resource.obj);
      //}
      //return filterResult;

      //return resources;
    }

  }))
  .actions(self => ({
    afterCreate() {
      self.load();
    }
  }));

  //const filterResourceByAllFilter = (
    //resources: any,
    //filteredTags: any,
    //catalogType: any,
    //resourceKind: any,
    //searchText: any
  //) => {
    //let filterResult = resources;
    //if (resourceKind.length > 0) {
      //let tempFilterResult: any = [];
      //resourceKind.forEach((kind: any) => {
        //filterResult.forEach((resource: any) => {
          //if (resource.type === kind) {
            //tempFilterResult.push(resource);
          //}
        //});
      //});
      //filterResult = tempFilterResult;
    //}
    //if (catalogType.length > 0) {
      //let tempFilterResult: any = [];
      //catalogType.forEach((catalogtype: any) => {
        //filterResult.forEach((resource: any) => {
          //if (resource.catalog.type === catalogtype) {
            //tempFilterResult.push(resource);
          //}
        //});
      //});
      //filterResult = tempFilterResult;
    //}
    //if (filteredTags.length > 0) {
      //let tempFilterResult: any = [];
      //filteredTags.forEach((tag: any) => {
        //filterResult.forEach((r: any) => {
          //r.tags.forEach((t: any) => {
            //if (t.name === tag) {
              //tempFilterResult.push(r);
            //}
          //});
        //});
      //});
      //filterResult = tempFilterResult;
    //}
    //if (searchText !== "") {
      //const tempFilterResult = fuzzysort.go(searchText, filterResult, {
        //keys: ["name", "displayName"]
      //});
      //filterResult = tempFilterResult.map((resource: any) => resource.obj);
    //}
    //return filterResult;
  //};
