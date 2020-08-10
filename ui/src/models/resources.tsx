import { types, flow, getEnv, Instance } from 'mobx-state-tree';
import { values } from 'mobx';


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
    isLoading: types.optional(types.boolean, true),
    err: types.optional(types.string, ""),
})
    .views((self) => ({
        get count() {
            return self.resourceList.length;
        },
        get resouresData() {
            return self.resourceList;
        },
        get resourcesSortByName() {
            return sortByName(values(self.resourceList));
        },
        get resourcesSortByRating() {
            return sortByRating(values(self.resourceList));
        },
        get fetch() {
            return getEnv(self).fetch;
        },
    }))
    .actions((self) => ({
        add(item: IResourceItem) {
            self.resourceList.push(item)

        },
        setStatus(status: boolean) {
            self.isLoading = status;
        },

    }))
    .actions((self) => ({
        load: flow(function* load() {
            try {
                const resources = yield self.fetch();
                resources.forEach((item: IResourceItem) => { self.add(item) });
                self.setStatus(false);

            } catch (error) {
                console.error("Failed to fetch resources", error)
                if (error) {
                    self.err = error.toString()
                }
            }

        })
    }))
    .actions((self) => ({
        afterCreate() {
            self.load();
        },

    }))

const sortByName = (resources: any) => {
    if (resources.length === 0) {
        return resources;
    }
    return resources.sort((resourceA: any, resourceB: any) =>
        resourceA.name > resourceB.name ? 1 : resourceA.name === resourceB.name ? 0 : -1
    );
}

const sortByRating = (resources: any) => {
    if (resources.length === 0) {
        return resources;
    }
    return resources.sort((resourceA: any, resourceB: any) =>
        resourceA.rating < resourceB.rating ? 1 : resourceA.rating === resourceB.rating ? 0 : -1
    );
}

export type IResourceItem = Instance<typeof ResourceItem>
export type IResources = Instance<typeof Resources>