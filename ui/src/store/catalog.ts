import { Instance, types } from 'mobx-state-tree';

export const Catalog = types
  .model({
    id: types.identifierNumber,
    name: types.optional(types.string, ''),
    type: types.optional(types.string, ''),
    selected: false
  })
  .actions((self) => ({
    toggle() {
      self.selected = !self.selected;
    }
  }));

export type ICatalog = Instance<typeof Catalog>;
export type ICatalogStore = Instance<typeof CatalogStore>;

export const CatalogStore = types
  .model({
    list: types.map(Catalog)
  })
  .actions((self) => ({
    addcatalog(item: ICatalog) {
      self.list.put(item);
    }
  }))
  .views((self) => ({
    get selectedCatalog() {
      let list: Array<number> = [];
      self.list.forEach((c: ICatalog) => {
        if (c.selected) {
          list.push(c.id);
        }
      });
      return list;
    }
  }));
