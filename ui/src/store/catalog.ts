import { types, Instance } from "mobx-state-tree"

export const Catalog = types
  .model({
    name: types.string,
    selected: false
  })
  .actions(self => ({
    toggle() {
      self.selected = !self.selected
    }
  }))

export type ICatalog = Instance<typeof Catalog>

interface catalogName {
  name: string
}

export const CatalogStore = types
  .model("CatalogStore", {
    list: types.array(Catalog)
  })

  .views(self => ({
    get count() {
      return self.list.length
    },
    get catalogs() {
      const { list } = self
      return list
        .filter((type: ICatalog) => type.selected)
        .map((type: ICatalog) => type.name)
    }
  }))

  .actions(self => ({
    add(item: catalogName) {
      self.list.push(item)
    },
    clearAll() {
      self.list.map((item: ICatalog) => (item.selected = false))
    }
  }))

export type ICatalogStore = Instance<typeof CatalogStore>
