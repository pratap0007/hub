import { types, Instance } from "mobx-state-tree"

export const CatalogType = types
  .model({
    name: types.string,
    selected: false,
  })
  .actions((self) => ({
    toggle() {
      self.selected = !self.selected
    },
  }))

export type ICatalogType = Instance<typeof CatalogType>

export const CatalogStore = types
  .model("CatalogStore", {
    list: types.array(CatalogType),
  })

  .views((self) => ({
    get count() {
      return self.list.length
    },
    get catalogs() {
      const { list } = self
      return list
        .filter((type: ICatalogType) => type.selected)
        .map((type: ICatalogType) => type.name)
    },
  }))

  .actions((self) => ({
    add(item: ICatalogType) {
      self.list.push(item)
    },
    clearAll() {
      self.list.map((item: ICatalogType) => (item.selected = false))
    },
  }))

export type ICatalogStore = Instance<typeof CatalogStore>
