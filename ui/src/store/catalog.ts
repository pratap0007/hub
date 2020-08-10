import { types, Instance } from "mobx-state-tree";
export const CatalogList = [
  { name: "official", selected: false },
  { name: "verified", selected: false },
  { name: "community", selected: false }
];

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
  .model({
    catalogtypelist: types.array(Catalog)
  })
  .views(self => ({
    get count() {
      return self.catalogtypelist.length;
    },
    get catalogType() {
      const { catalogtypelist } = self;
      return catalogtypelist
        .filter((type: ICatalog) => type.selected === true)
        .map((type: ICatalog) => type.name);
    }
  }))
  .actions(self => ({
    add(item: ICatalog) {
      self.catalogtypelist.push(item);
    },
    selectedCatalogType(kindName: string) {
      self.catalogtypelist.forEach((kind: ICatalog) => {
        if (kind.name === kindName) {
          kind.toggle();
          return;
        }
      });
    }
  }))

  // TODO () =>  is this required
  .actions(self => ({
    loadCatalogType() {
      CatalogList.forEach((kind: any) => self.add(kind));
    }
  }))
  .actions(self => ({
    afterCreate() {
      self.loadCatalogType();
    }
  }));
