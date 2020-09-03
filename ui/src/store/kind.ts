import { types, Instance } from "mobx-state-tree";

export const Kind = types
  .model({
    name: types.string,
    selected: false
  })
  .actions(self => ({
    toggle() {
      self.selected = !self.selected;
    }
  }));

export type IKind = Instance<typeof Kind>;

export const KindStore = types
  .model({
    kindList: types.array(Kind)
  })
  .views(self => ({
    get count() {
      return self.kindList.length;
    },
    get selectedkind() {
      const { kindList } = self;
      return kindList
        .filter((type: IKind) => type.selected)
        .map((type: IKind) => type.name);
    },
    get list() {
      const { kindList } = self;
      return kindList;
    }
  }))
  .actions(self => ({
    add(item: any) {
      self.kindList.push(item);
    },
    toggleKind(kindName: string) {
      self.kindList.forEach((kind: IKind) => {
        if (kind.name === kindName) {
          kind.toggle();
          return;
        }
      });
    },
    clearAll() {
      self.kindList.map((item: IKind) => (item.selected = false));
    }
  }));

  export type IKindStore = Instance<typeof KindStore>;
