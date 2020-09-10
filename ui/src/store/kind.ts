import { types, Instance } from "mobx-state-tree"

export const Kind = types
  .model({
    name: types.string,
    selected: false
  })
  .actions(self => ({
    toggle() {
      self.selected = !self.selected
    }
  }))

export type IKind = Instance<typeof Kind>

interface kindName {
  name: string
}

export const KindStore = types
  .model({
    list: types.array(Kind)
  })

  .views(self => ({
    get count() {
      return self.list.length
    },
    get kinds() {
      const { list } = self
      return list
        .filter((type: IKind) => type.selected)
        .map((type: IKind) => type.name)
    }
  }))

  .actions(self => ({
    add(item: kindName) {
      self.list.push(item)
    },
    clearAll() {
      self.list.map((item: IKind) => (item.selected = false))
    }
  }))

export type IKindStore = Instance<typeof KindStore>
