import { types, Instance } from 'mobx-state-tree';

export const Kind = types
  .model('Kind', {
    id: types.integer,
    name: types.string,
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
  .model('KindStore', {
    list: types.array(Kind)
  })

  .views((self) => ({
    get count(): number {
      return self.list.length;
    },
    get kinds(): Array<string> {
      const { list } = self;
      return list.filter((type: IKind) => type.selected).map((type: IKind) => type.name);
    }
  }))

  .actions((self) => ({
    add(item: IKind) {
      self.list.push(item);
    },
    clear() {
      self.list.map((item: IKind) => (item.selected = false));
    }
  }));
