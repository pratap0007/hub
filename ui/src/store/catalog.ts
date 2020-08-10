import { types, Instance } from "mobx-state-tree";

export const Catalog = types
  .model({
    name: types.string,
    selected: false
  })
  .actions(self => ({
    toggle() {
      self.selected = !self.selected;
    }
  }));

export type ICatalog = Instance<typeof Catalog>;

export const CatalogStore = types
  .model("CatalogStore", {
    catalogList: types.array(Catalog)
  })

  .views(self => ({
    get count() {
      return self.catalogList.length;
    },
    get list() {
      const { catalogList } = self;
      return catalogList;
    },
    get selectedCatalogType() {
      const { catalogList } = self;
      return catalogList
        .filter((type: ICatalog) => type.selected)
        .map((type: ICatalog) => type.name);
    }
  }))

  .actions(self => ({
    add(item: any) {
      self.catalogList.push(item);
    },
    toggleCatalogType(kindName: string) {
      self.catalogList.forEach((kind: ICatalog) => {
        if (kind.name === kindName) {
          kind.toggle();
          return;
        }
      });
    },
    clearAll() {
      self.catalogList.map((item: ICatalog) => (item.selected = false));
    }
  }));
