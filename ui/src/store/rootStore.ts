import { types, getEnv } from 'mobx-state-tree';
import { CategoryStore } from './category';
import { ResourceStore } from './resource';
import { Api } from '../api';

export const RootStore = types
  .model('RootStore', {
    category: CategoryStore,
    resources: ResourceStore
  })
  .views((self) => ({
    get api(): Api {
      return getEnv(self).api;
    }
  }))

  .actions((self) => ({
    afterCreate() {
      self.category.load();
      self.resources.load();
    }
  }));
