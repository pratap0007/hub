import { types, Instance } from 'mobx-state-tree';
import { Tag } from './category';
import { flow, getEnv } from 'mobx-state-tree';
import { Api } from '../api';

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

export const kind = types.model({
  name: types.identifier,
  selected: false
});

const VersionInfo = types.model({
  id: types.identifierNumber,
  version: types.string,
  displayName: types.string,
  description: types.string,
  minPipelinesVersion: types.string,
  rawURL: types.string,
  webURL: types.string,
  updatedAt: types.string
  // resource: types.late(() => types.reference(Resource))
});

export const Resource = types.model({
  id: types.identifierNumber,
  name: types.optional(types.string, ''),
  catalog: types.reference(Catalog),
  kind: types.reference(kind),
  latestVersion: types.reference(VersionInfo),
  tags: types.array(types.reference(Tag)), // ["1", "2"]
  rating: types.number,
  versions: types.map(VersionInfo)
});

export type IKind = Instance<typeof kind>;
export type ICatalog = Instance<typeof Catalog>;
export type IResource = Instance<typeof Resource>;

export const RootStore = types
  .model({
    resources: types.map(Resource),
    versions: types.map(VersionInfo),
    catalog: types.map(Catalog),
    kind: types.map(kind),
    err: '',
    isLoading: true
  })
  .views((self) => ({
    get api(): Api {
      return getEnv(self).api;
    }
  }))
  .actions((self) => ({
    setLoading(l: boolean) {
      self.isLoading = l;
    },

    addResources(item: IResource) {
      self.resources.put(item);
    },

    addCatalog(item: ICatalog) {
      // item.id = String(item.id);
      self.catalog.put(item);
    },

    addKind(item: string) {
      self.kind.put({ name: item });
    },

    addVersionInfo(item: any) {
      self.versions.put(item);
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
            item.tags[i] = item.tags[i].id;
          }
          self.addKind(item.kind);
          self.addCatalog(item.catalog);
          item.catalog = item.catalog.id;

          self.versions.put(item.latestVersion);
          item.latestVersion = item.latestVersion.id;
          self.addResources(item);
        });
      } catch (err) {
        console.log(err);
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
