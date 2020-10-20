import { types, Instance } from 'mobx-state-tree';

export const CatalogType = types
  .model({
    id: types.integer,
    name: types.string,
    selected: false
  })
  .actions((self) => ({
    toggle() {
      self.selected = !self.selected;
    }
  }));

export type ICatalogType = Instance<typeof CatalogType>;
export type ICatalogStore = Instance<typeof CatalogStore>;

export const CatalogStore = types
  .model('CatalogStore', {
    list: types.array(CatalogType)
  })

  .views((self) => ({
    get count(): number {
      return self.list.length;
    },
    get catalogs(): Array<string> {
      const { list } = self;
      return list
        .filter((type: ICatalogType) => type.selected)
        .map((type: ICatalogType) => type.name);
    }
  }))

  .actions((self) => ({
    add(item: ICatalogType) {
      self.list.push(item);
    },
    clear() {
      self.list.map((item: ICatalogType) => (item.selected = false));
    }
  }));
