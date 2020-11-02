import { types, getEnv, flow, Instance } from 'mobx-state-tree';
import { Api } from '../api';

export const Tag = types.model('Tags', {
  id: types.identifierNumber,
  name: types.string
});

export const Category = types
  .model('Category', {
    id: types.identifierNumber,
    name: types.string,
    tags: types.array(types.reference(Tag)),
    selected: false
  })
  .actions((self) => ({
    toggle() {
      self.selected = !self.selected;
    }
  }));

export type ICategory = Instance<typeof Category>;

export const CategoryStore = types
  .model('CategoryStore', {
    list: types.map(Category),
    tags: types.map(Tag),
    isLoading: true,
    err: ''
  })

  .views((self) => ({
    get api(): Api {
      return getEnv(self).api;
    },

    get count() {
      return self.list.size;
    },

    get tag() {
      return Array.from(self.list.values())
        .filter((c) => c.selected)
        .reduce((acc: string[], c: any) => [...acc, ...c.tags.map((t) => t.id)], []);
    }
  }))

  .actions((self) => ({
    add(item: ICategory) {
      self.list.put(item);
    },

    addTags(item: any) {
      self.tags.set(String(item.id), { id: item.id, name: item.name });
    },

    setLoading(l: boolean) {
      self.isLoading = l;
    },

    clear() {
      self.list.forEach((c) => {
        c.selected = false;
      });
    }
  }))

  .actions((self) => ({
    load: flow(function* () {
      try {
        self.setLoading(true);
        const { api } = self;
        const json = yield api.categories();
        json.data.forEach((item: any) => {
          item.tags.forEach((tag: any) => {
            self.addTags(tag);
          });

          for (let i = 0; i < item.tags.length; i++) {
            item.tags[i] = item.tags[i].id;
          }
          self.add(item);
        });
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

export type ICategoryStore = Instance<typeof CategoryStore>;
