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
    add(item: ICatalog) {
      self.list.put({ id: item.id, name: item.name, type: item.type });
    },
    clear() {
      self.list.forEach((c) => {
        c.selected = false;
      });
    }
  }))
  .views((self) => ({
    get selected() {
      const list: Array<number> = [];
      self.list.forEach((c: ICatalog) => {
        if (c.selected) {
          list.push(c.id);
        }
      });
      return list;
    }
  }));
