package design

import (
	. "goa.design/goa/v3/dsl"
)

var _ = Service("resourceversions", func() {
	Description("The category service gives category details")

	Error("internal-error", ErrorResult)

	//Method to get all versions information of a resource by resourceId
	Method("Resourceversionsdetail", func() {
		Description("Get all versions information of a resource by resourceId")
		Result(ArrayOf(ResourceVersion))
		Payload(ResourceId)
		HTTP(func() {
			GET("/resource/{resourceId}/versions")
			Response(StatusOK)
			Response("internal-error", StatusInternalServerError)
		})
	})
})
