import { Instance, types, flow, getEnv } from 'mobx-state-tree';
import { Icons } from '../common/icons';
import { Api } from '../api';
import { copyFileSync } from 'fs';

const icons: { [catalog: string]: Icons } = {
  official: Icons.Cat,
  verified: Icons.Certificate,
  community: Icons.User
};

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
  }))
  .views((self) => ({
    get icon(): Icons {
      return icons[self.type] || Icons.Unknown;
    }
  }));

export type ICatalog = Instance<typeof Catalog>;
export type ICatalogStore = Instance<typeof CatalogStore>;

export const CatalogStore = types
  .model({
    items: types.map(Catalog),
    isLoading: true,
    err: ''
  })

  .actions((self) => ({
    add(item: ICatalog) {
      self.items.put({ id: item.id, name: item.name, type: item.type });
    },
    clearSelected() {
      self.items.forEach((c) => {
        c.selected = false;
      });
    },
    setLoading(l: boolean) {
      self.isLoading = l;
    }
  }))

  .views((self) => ({
    get values() {
      return Array.from(self.items.values());
    },

    get api(): Api {
      return getEnv(self).api;
    },

    get selected() {
      const list = new Set();
      self.items.forEach((c: ICatalog) => {
        if (c.selected) {
          list.add(c.id);
        }
      });

      return list;
    }
  }))
  .actions((self) => ({
    load: flow(function* () {
      try {
        self.setLoading(true);
        const { api } = self;

        const json = yield api.catalogs();

        const catalogs: ICatalog[] = json.data.map((c: ICatalog) => ({
          id: c.id,
          name: c.name,
          type: c.type
        }));

        console.log('ccc', catalogs);
        catalogs.forEach((c: ICatalog) => self.add(c));
      } catch (err) {
        self.err = err.toString();
      }

      self.setLoading(false);
    })
  }))

  .actions((self) => ({
    afterCreate() {
      self.load();
    }
  }));
