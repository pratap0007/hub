import { types, Instance } from 'mobx-state-tree';
import { Tag } from './category';
import { flow, getEnv } from 'mobx-state-tree';
import { Api } from '../api';

export const catalog = types
  .model({
    id: types.identifier,
    name: types.optional(types.string, ''),
    type: types.optional(types.string, ''),
    selected: false
  })
  .actions((self) => ({
    toggle() {
      self.selected = !self.selected;
    }
  }));

export const kind = types
  .model({
    id: types.number,
    name: types.identifier,
    selected: false
  })
  .actions((self) => ({
    toggle(): void {
      self.selected = !self.selected;
    }
  }));

const latestVersion = types.model({
  id: types.number,
  version: types.string,
  displayName: types.string,
  description: types.string,
  minPipelinesVersion: types.string,
  rawURL: types.string,
  webURL: types.string,
  updatedAt: types.string
});

export const resource = types.model({
  id: types.identifier,
  name: types.optional(types.string, ''),
  catalog: types.reference(catalog),
  kind: types.reference(kind),
  latestVersion: latestVersion,
  tags: types.array(types.reference(Tag)), // ["1", "2"]
  rating: types.number
});

export type IKind = Instance<typeof kind>;
export type ICatalog = Instance<typeof catalog>;
export type IResource = Instance<typeof resource>;

export const RootStore = types
  .model({
    resources: types.map(resource),
    catalog: types.map(catalog),
    kind: types.map(kind),
    search: '',
    err: '',
    isLoading: true
  })
  .views((self) => ({
    get api(): Api {
      return getEnv(self).api;
    },
    get selectedCatalog() {
      let list: any = [];
      self.catalog.forEach((c: any) => {
        if (c.selected) {
          list.push(c.id);
        }
      });
      return list;
    },
    get selectedKind() {
      let list: any = [];
      self.kind.forEach((c: any) => {
        if (c.selected) {
          list.push(c.name);
        }
      });
      return list;
    }
  }))
  .actions((self) => ({
    setLoading(l: boolean) {
      self.isLoading = l;
    },
    setSearch(text: string) {
      self.search = text;
    },
    addResources(item: IResource) {
      item.id = String(item.id);
      self.resources.put(item);
    },

    addCatalog(item: ICatalog) {
      item.id = String(item.id);
      self.catalog.put(item);
    },

    addKind(item: string) {
      let size = self.kind.size;

      if (!self.kind.has(item)) {
        size = size + 1;
      }
      self.kind.put({ name: item, id: size });
    }
  }))
  .actions((self) => ({
    load: flow(function* () {
      try {
        self.setLoading(true);

        const { api } = self;
        const json = yield api.resources();

        json.data.forEach((item: any) => {
          for (let i = 0; i < item.tags.length; i++) {
            item.tags[i] = String(item.tags[i].id);
          }
          self.addKind(item.kind);
          self.addCatalog(item.catalog);
          item.catalog = item.catalog.id;
          self.addResources(item);
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
  }))
  .views((self) => ({
    get listData() {
      return null;
    }
  }));
