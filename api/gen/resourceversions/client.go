// Code generated by goa v3.1.3, DO NOT EDIT.
//
// resourceversions client
//
// Command:
// $ goa gen github.com/tektoncd/hub/api/design

package resourceversions

import (
	"context"

	goa "goa.design/goa/v3/pkg"
)

// Client is the "resourceversions" service client.
type Client struct {
	ResourceversionsdetailEndpoint goa.Endpoint
}

// NewClient initializes a "resourceversions" service client given the
// endpoints.
func NewClient(resourceversionsdetail goa.Endpoint) *Client {
	return &Client{
		ResourceversionsdetailEndpoint: resourceversionsdetail,
	}
}

// Resourceversionsdetail calls the "Resourceversionsdetail" endpoint of the
// "resourceversions" service.
func (c *Client) Resourceversionsdetail(ctx context.Context, p *ResourceID) (res []*Resourceversion, err error) {
	var ires interface{}
	ires, err = c.ResourceversionsdetailEndpoint(ctx, p)
	if err != nil {
		return
	}
	return ires.([]*Resourceversion), nil
}
