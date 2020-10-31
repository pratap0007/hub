import { types, Instance } from 'mobx-state-tree';

export const Kind = types
  .model({
    name: types.identifier,
    selected: false
  })
  .actions((self) => ({
    toggle() {
      self.selected = !self.selected;
    }
  }));

export type IKind = Instance<typeof Kind>;
export type IKindStore = Instance<typeof KindStore>;

export const KindStore = types
  .model({
    list: types.map(Kind)
  })
  .actions((self) => ({
    add(item: string) {
      self.list.put({ name: item, selected: false });
    },

    clear() {
      self.list.forEach((c) => {
        c.selected = false;
      });
    }
  }))
  .views((self) => ({
    get selected() {
      const list: Array<string> = [];
      self.list.forEach((c: IKind) => {
        if (c.selected) {
          list.push(c.name);
        }
      });
      return list;
    }
  }));
