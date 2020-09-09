import { types, getEnv, flow, Instance } from "mobx-state-tree";
import { Api } from "../api";

export const Tag = types.model("Tags", {
  id: types.integer,
  name: types.string
});

export const Category = types
  .model("Category", {
    id: types.number,
    name: types.string,
    tags: types.array(Tag),
    selected: false
  })

  .actions(self => ({
    toggle() {
      self.selected = !self.selected;
    }
  }));

export type ICategory = Instance<typeof Category>;

export const CategoryStore = types
  .model("CategoryStore", {
    categories: types.array(Category),
    isLoading: true,
    err: ""
  })

  .views(self => ({
    get api(): Api {
      return getEnv(self).api;
    },
    get count() {
      return self.categories.length;
    },
    get list() {
      const { categories } = self;
      return categories;
    },
    get tags() {
      return self.categories
        .filter(c => c.selected)
        .reduce(
          (acc: string[], c: ICategory) => [...acc, ...c.tags.map(t => t.name)],
          []
        );
    }
  }))

  .actions(self => ({
    add(item: ICategory) {
      self.categories.push(item);
    },
    setLoading(l: boolean) {
      self.isLoading = l;
    },
    clearAll() {
      self.categories.map((c: ICategory) => (c.selected = false));
    }
  }))
  .actions(self => ({
    loadCategories: flow(function*() {
      try {
        self.setLoading(true);

        const { api } = self;
        const json = yield api.categories();
        json.data.forEach((item: ICategory) => {
          self.add(item);
        });
      } catch (err) {
        self.err = err.toString();
      }
      self.setLoading(false);
    })
  }))

  .actions(self => ({
    afterCreate() {
      self.categories.clear();
      self.loadCategories();
    }
  }));

export type ICategoryStore = Instance<typeof CategoryStore>;
