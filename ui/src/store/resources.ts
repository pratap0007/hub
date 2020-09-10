import { types, getEnv, flow, Instance } from "mobx-state-tree"
import { Api } from "../api"
import { ICategoryStore, Tag } from "./category"
import { IKindStore } from "./kind"
import { ICatalogStore } from "./catalog"
import fuzzysort from "fuzzysort"

const Catalog = types.model("Catalog", {
  id: types.number,
  type: types.string,
})

const ResourceVersion = types.model("Version", {
  id: types.number,
  version: types.optional(types.string, "0.1"),
  displayName: types.string,
  description: types.string,
  minPipelinesVersion: types.optional(types.string, ""),
  rawURL: types.string,
  webURL: types.string,
  updatedAt: types.string,
})

export const Resource = types.model("Resource", {
  id: types.number,
  kind: types.string,
  name: types.string,
  catalog: Catalog,
  latestVersion: ResourceVersion,
  tags: types.optional(types.array(Tag), []),
  rating: types.optional(types.number, 0),
})

export type IResource = Instance<typeof Resource>
export type ITag = Instance<typeof Tag>

export const ResourceStore = types
  .model("ResourceStore", {
    resources: types.array(Resource),
    isLoading: true,
    searchText: types.optional(types.string, ""),
    err: "",
  })

  .views((self) => ({
    get api(): Api {
      return getEnv(self).api
    },
    get kindStore(): IKindStore {
      return getEnv(self).kindStore
    },
    get catalogStore(): ICatalogStore {
      return getEnv(self).catalogStore
    },
    get categoryStore(): ICategoryStore {
      return getEnv(self).categoryStore
    },
    get count() {
      return self.resources.length
    },
    get searchResource() {
      const { searchText } = self
      return searchText
    },
    get resourceList() {
      const { resources } = self
      return resources
    },
  }))

  .actions((self) => ({
    add(item: IResource) {
      self.resources.push(item)
    },
    setLoading(l: boolean) {
      self.isLoading = l
    },
    setSearch(text: string) {
      self.searchText = text
    },
  }))

  .actions((self) => ({
    load: flow(function* () {
      try {
        self.setLoading(true)

        const { api } = self
        const catalogData = new Set()
        const kindData = new Set()
        const json = yield api.resources()
        json.data.forEach((item: IResource) => {
          self.add(item)
          catalogData.add(item.catalog.type)
          kindData.add(item.kind)
        })

        kindData.forEach((kindName: any) => {
          self.kindStore.add({ name: kindName })
        })

        catalogData.forEach((catalogName: any) => {
          self.catalogStore.add({ name: catalogName })
        })
      } catch (err) {
        self.err = err.toString()
      }
      self.setLoading(false)
    }),
  }))

  .views((self) => ({
    get list() {
      const { resources } = self
      const { searchText } = self

      const kind = new Set(self.kindStore.kinds)
      const tag = new Set(self.categoryStore.tags)
      const catalog = new Set(self.catalogStore.catalogs)

      const filterResources = resources.filter(
        (r: IResource) =>
          (tag.size > 0 ? r.tags.some((t: ITag) => tag.has(t.name)) : true) &&
          (catalog.size > 0 ? catalog.has(r.catalog.type) : true) &&
          (kind.size > 0 ? kind.has(r.kind) : true)
      )

      return searchText !== ""
        ? fuzzysort
            .go(searchText, filterResources, {
              keys: ["name", "displayName"],
            })
            .map((resource: Fuzzysort.KeysResult<IResource>) => resource.obj)
        : filterResources
    },
  }))

  .actions((self) => ({
    afterCreate() {
      self.load()
    },
  }))
