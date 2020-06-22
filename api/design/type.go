package design

import (
	. "goa.design/goa/v3/dsl"
)

var Category = Type("category", func() {
	Attribute("id", UInt, "unique id of category", func() {
		Example("id", 1)
	})
	Attribute("name", String, "name of category", func() {
		Example("name", "Image-build")
	})
	Attribute("tags", ArrayOf(ResourceTags), "list of tag associated with category")
	Required("id", "name", "tags")
})
var ResourceTags = Type("Tag", func() {
	Attribute("id", UInt, "Id is the unique id of tags", func() {
		Example("id", 1)
	})
	Attribute("name", String, "name of tag", func() {
		Example("name", "cli")
	})
	Required("id", "name")
})

var ResourceVersion = ResultType("ResourceVersion", func() {
	Reference(Resource)
	Attributes(func() {

		Attribute("id")

		Attribute("name")

		Attribute("catalog")

		Attribute("type")

		Attribute("tags")

		Attribute("rating")

		Attribute("versions", ArrayOf(ResourceVersionInfo), " versions information of a resource")
	})

	Required("id", "name", "catalog", "type", "rating", "tags", "versions")

})

var ResourceId = Type("ResourceId", func() {
	Attribute("resourceId", Int, "id of resource")
	Required("resourceId")
})

var Resource = ResultType("Resource", func() {
	Attribute("id", UInt, "ID is the unique id of the resource", func() {
		Example("id", 1)
	})
	Attribute("name", String, "Name of the resource", func() {
		Example("name", "golang")
	})
	Attribute("catalog", Catalog, "Type of catalog where resource belongs")
	Attribute("type", String, "Type of resource", func() {
		Example("type", "task")
	})
	Attribute("tags", ArrayOf(ResourceTags), "Tags related to resources")
	Attribute("rating", UInt, "Rating of resource", func() {
		Example("rating", 5)
	})
	View("default", func() {
		Attribute("id")
		Attribute("name")
		Attribute("catalog")
		Attribute("type")
		Attribute("tags")
		Attribute("rating")
	})
	View("extended", func() {
		Attribute("id")
		Attribute("name")
		Attribute("catalog")
		Attribute("type")
		Attribute("tags")
		Attribute("rating")
	})
	Required("id", "name", "catalog", "type", "tags", "rating")
})

var ResourceVersionInfo = Type("ResourceVersionInfo", func() {
	Attribute("id", UInt, "resource version id", func() {
		Example("id", 1)
	})
	Attribute("version", String, "version name", func() {
		Example("version", "1.0")
	})
	Attribute("description", String, "description of perticular version", func() {
		Example("description", "This Task builds source into a container image")
	})
	Attribute("displayName", String, "displayname of perticular version", func() {
		Example("displayName", "git clone")
	})
	Attribute("rawUrl", String, "github raw url of perticular veriosn of a resource", func() {
		Example("rawUrl", "https://raw.github.com/Pipelines-Marketplace/catalog/tree/master/task/kaniko/0.1/")
	})
	Attribute("webUrl", String, "github web url of perticular veriosn of a resource", func() {
		Example("webUrl", "https://github.com/Pipelines-Marketplace/catalog/tree/master/task/kaniko/0.1/")
	})
	Attribute("updatedAt", String, "Date when resource was last updated", func() {
		Example("updatedAt", "2020-03-26T14:09:08.19599+05:30")
	})
	Required("id", "version", "description", "displayName", "rawUrl", "webUrl", "updatedAt")

})

var Catalog = Type("Catalog", func() {
	Attribute("id", UInt, "ID is the unique id of the category", func() {
		Example("id", 1)
	})
	Attribute("type", String, "Type of support tier", func() {
		Example("type", "official")
	})
	Required("id", "type")
})
