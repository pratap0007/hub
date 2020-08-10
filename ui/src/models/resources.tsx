import { types, flow, getEnv, Instance, getSnapshot } from 'mobx-state-tree';


const Catalog = types.model("Catalog", {
    id: types.optional(types.number, 0),
    type: types.optional(types.string, ""),
})

export const Tag = types.model("Tag", {
    id: types.optional(types.number, 0),
    name: types.optional(types.string, " ")


})

export const LatestVersion = types.model("Version", {
    id: types.number,
    version: types.optional(types.string, "0.1"),
    displayName: types.string,
    description: types.string,
    minPipelinesVersion: types.optional(types.string, ""),
    rawURL: types.string,
    webURL: types.string,
    updatedAt: types.string,
})

export const ResourceItem = types.model("ResourceItem", {
    id: types.number,
    type: types.string,
    name: types.string,
    catalog: Catalog,
    latestVersion: LatestVersion,
    tags: types.optional(types.array(Tag), []),
    rating: types.optional(types.number, 0),

})

export const Resources = types.model("Resources", {
    resourceList: types.optional(types.array(ResourceItem), []),
    isLoading: types.optional(types.boolean, false)
})
    .views((self) => ({
        get count() {
            return self.resourceList.length;
        },
        get fetch() {
            return getEnv(self).fetch || window.fetch.bind(self);
        },
    }))
    .actions((self) => ({
        add(item: IResourceItem) {
            self.resourceList.push(item)

        }

    }))
    .actions((self) => ({
        load: flow(function* () {
            console.log("7777", { self })

            try {
                const resp = yield window.fetch('/resources.json').then((res: any) => res.json())
                resp.forEach((item: IResourceItem) => { self.add(item) })
                console.log(getSnapshot(self.resourceList))
            } catch (error) {
                console.error("Failed to fetch resources", error)
            }

        })
    }))
    .actions((self) => ({
        afterCreate() {
            self.load();
        },

    }))

export type IResourceItem = Instance<typeof ResourceItem>