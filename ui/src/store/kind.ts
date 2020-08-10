import { types, Instance } from "mobx-state-tree";

export const KindList = [
  { name: "task", selected: false },
  { name: "pipeline", selected: false }
];

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
    resourcekindlist: types.array(Kind)
  })
  .views(self => ({
    get count() {
      return self.resourcekindlist.length;
    },
    get resourceKind() {
      const { resourcekindlist } = self;
      return resourcekindlist
        .filter((type: IKind) => type.selected)
        .map((type: IKind) => type.name);
    }
  }))
  .actions(self => ({
    add(item: IKind) {
      self.resourcekindlist.push(item);
    },
    selectedKind(kindName: string) {
      self.resourcekindlist.forEach((kind: IKind) => {
        if (kind.name === kindName) {
          kind.toggle();
          return;
        }
      });
    }
  }))
  .actions(self => ({
    loadKind() {
      KindList.forEach((kind: any) => self.add(kind));
    }
  }))
  .actions(self => ({
    afterCreate() {
      self.loadKind();
    }
  }));
