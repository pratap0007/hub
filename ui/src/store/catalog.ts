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

export const CatalogStore = types
  .model({
    list: types.map(Catalog)
  })
  .actions((self) => ({
    addcatalog(item: any) {
      self.list.put(item);
    }
  }))
  .views((self) => ({
    get selectedCatalog() {
      let list: Array<string> = [];
      self.list.forEach((c: any) => {
        if (c.selected) {
          list.push(c.id);
        }
      });
      return list;
    }
  }));

export type ICatalog = Instance<typeof Catalog>;
export type ICatalogStore = Instance<typeof CatalogStore>;
