// Code generated by goa v3.2.2, DO NOT EDIT.
//
// resource HTTP client encoders and decoders
//
// Command:
// $ goa gen github.com/tektoncd/hub/api/design

package client

import (
	"bytes"
	"context"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"

	resource "github.com/tektoncd/hub/api/gen/resource"
	resourceviews "github.com/tektoncd/hub/api/gen/resource/views"
	goahttp "goa.design/goa/v3/http"
)

// BuildQueryRequest instantiates a HTTP request object with method and path
// set to call the "resource" service "Query" endpoint
func (c *Client) BuildQueryRequest(ctx context.Context, v interface{}) (*http.Request, error) {
	u := &url.URL{Scheme: c.scheme, Host: c.host, Path: QueryResourcePath()}
	req, err := http.NewRequest("GET", u.String(), nil)
	if err != nil {
		return nil, goahttp.ErrInvalidURL("resource", "Query", u.String(), err)
	}
	if ctx != nil {
		req = req.WithContext(ctx)
	}

	return req, nil
}

// EncodeQueryRequest returns an encoder for requests sent to the resource
// Query server.
func EncodeQueryRequest(encoder func(*http.Request) goahttp.Encoder) func(*http.Request, interface{}) error {
	return func(req *http.Request, v interface{}) error {
		p, ok := v.(*resource.QueryPayload)
		if !ok {
			return goahttp.ErrInvalidType("resource", "Query", "*resource.QueryPayload", v)
		}
		values := req.URL.Query()
		values.Add("name", p.Name)
		values.Add("type", p.Type)
		values.Add("limit", fmt.Sprintf("%v", p.Limit))
		req.URL.RawQuery = values.Encode()
		return nil
	}
}

// DecodeQueryResponse returns a decoder for responses returned by the resource
// Query endpoint. restoreBody controls whether the response body should be
// restored after having been read.
// DecodeQueryResponse may return the following errors:
//	- "internal-error" (type *goa.ServiceError): http.StatusInternalServerError
//	- "not-found" (type *goa.ServiceError): http.StatusNotFound
//	- error: internal error
func DecodeQueryResponse(decoder func(*http.Response) goahttp.Decoder, restoreBody bool) func(*http.Response) (interface{}, error) {
	return func(resp *http.Response) (interface{}, error) {
		if restoreBody {
			b, err := ioutil.ReadAll(resp.Body)
			if err != nil {
				return nil, err
			}
			resp.Body = ioutil.NopCloser(bytes.NewBuffer(b))
			defer func() {
				resp.Body = ioutil.NopCloser(bytes.NewBuffer(b))
			}()
		} else {
			defer resp.Body.Close()
		}
		switch resp.StatusCode {
		case http.StatusOK:
			var (
				body QueryResponseBody
				err  error
			)
			err = decoder(resp).Decode(&body)
			if err != nil {
				return nil, goahttp.ErrDecodingError("resource", "Query", err)
			}
			p := NewQueryResourceCollectionOK(body)
			view := "withoutVersion"
			vres := resourceviews.ResourceCollection{Projected: p, View: view}
			if err = resourceviews.ValidateResourceCollection(vres); err != nil {
				return nil, goahttp.ErrValidationError("resource", "Query", err)
			}
			res := resource.NewResourceCollection(vres)
			return res, nil
		case http.StatusInternalServerError:
			var (
				body QueryInternalErrorResponseBody
				err  error
			)
			err = decoder(resp).Decode(&body)
			if err != nil {
				return nil, goahttp.ErrDecodingError("resource", "Query", err)
			}
			err = ValidateQueryInternalErrorResponseBody(&body)
			if err != nil {
				return nil, goahttp.ErrValidationError("resource", "Query", err)
			}
			return nil, NewQueryInternalError(&body)
		case http.StatusNotFound:
			var (
				body QueryNotFoundResponseBody
				err  error
			)
			err = decoder(resp).Decode(&body)
			if err != nil {
				return nil, goahttp.ErrDecodingError("resource", "Query", err)
			}
			err = ValidateQueryNotFoundResponseBody(&body)
			if err != nil {
				return nil, goahttp.ErrValidationError("resource", "Query", err)
			}
			return nil, NewQueryNotFound(&body)
		default:
			body, _ := ioutil.ReadAll(resp.Body)
			return nil, goahttp.ErrInvalidResponse("resource", "Query", resp.StatusCode, string(body))
		}
	}
}

// BuildListRequest instantiates a HTTP request object with method and path set
// to call the "resource" service "List" endpoint
func (c *Client) BuildListRequest(ctx context.Context, v interface{}) (*http.Request, error) {
	u := &url.URL{Scheme: c.scheme, Host: c.host, Path: ListResourcePath()}
	req, err := http.NewRequest("GET", u.String(), nil)
	if err != nil {
		return nil, goahttp.ErrInvalidURL("resource", "List", u.String(), err)
	}
	if ctx != nil {
		req = req.WithContext(ctx)
	}

	return req, nil
}

// EncodeListRequest returns an encoder for requests sent to the resource List
// server.
func EncodeListRequest(encoder func(*http.Request) goahttp.Encoder) func(*http.Request, interface{}) error {
	return func(req *http.Request, v interface{}) error {
		p, ok := v.(*resource.ListPayload)
		if !ok {
			return goahttp.ErrInvalidType("resource", "List", "*resource.ListPayload", v)
		}
		values := req.URL.Query()
		values.Add("limit", fmt.Sprintf("%v", p.Limit))
		req.URL.RawQuery = values.Encode()
		return nil
	}
}

// DecodeListResponse returns a decoder for responses returned by the resource
// List endpoint. restoreBody controls whether the response body should be
// restored after having been read.
// DecodeListResponse may return the following errors:
//	- "internal-error" (type *goa.ServiceError): http.StatusInternalServerError
//	- error: internal error
func DecodeListResponse(decoder func(*http.Response) goahttp.Decoder, restoreBody bool) func(*http.Response) (interface{}, error) {
	return func(resp *http.Response) (interface{}, error) {
		if restoreBody {
			b, err := ioutil.ReadAll(resp.Body)
			if err != nil {
				return nil, err
			}
			resp.Body = ioutil.NopCloser(bytes.NewBuffer(b))
			defer func() {
				resp.Body = ioutil.NopCloser(bytes.NewBuffer(b))
			}()
		} else {
			defer resp.Body.Close()
		}
		switch resp.StatusCode {
		case http.StatusOK:
			var (
				body ListResponseBody
				err  error
			)
			err = decoder(resp).Decode(&body)
			if err != nil {
				return nil, goahttp.ErrDecodingError("resource", "List", err)
			}
			p := NewListResourceCollectionOK(body)
			view := "withoutVersion"
			vres := resourceviews.ResourceCollection{Projected: p, View: view}
			if err = resourceviews.ValidateResourceCollection(vres); err != nil {
				return nil, goahttp.ErrValidationError("resource", "List", err)
			}
			res := resource.NewResourceCollection(vres)
			return res, nil
		case http.StatusInternalServerError:
			var (
				body ListInternalErrorResponseBody
				err  error
			)
			err = decoder(resp).Decode(&body)
			if err != nil {
				return nil, goahttp.ErrDecodingError("resource", "List", err)
			}
			err = ValidateListInternalErrorResponseBody(&body)
			if err != nil {
				return nil, goahttp.ErrValidationError("resource", "List", err)
			}
			return nil, NewListInternalError(&body)
		default:
			body, _ := ioutil.ReadAll(resp.Body)
			return nil, goahttp.ErrInvalidResponse("resource", "List", resp.StatusCode, string(body))
		}
	}
}

// BuildVersionsByIDRequest instantiates a HTTP request object with method and
// path set to call the "resource" service "VersionsByID" endpoint
func (c *Client) BuildVersionsByIDRequest(ctx context.Context, v interface{}) (*http.Request, error) {
	var (
		id uint
	)
	{
		p, ok := v.(*resource.VersionsByIDPayload)
		if !ok {
			return nil, goahttp.ErrInvalidType("resource", "VersionsByID", "*resource.VersionsByIDPayload", v)
		}
		id = p.ID
	}
	u := &url.URL{Scheme: c.scheme, Host: c.host, Path: VersionsByIDResourcePath(id)}
	req, err := http.NewRequest("GET", u.String(), nil)
	if err != nil {
		return nil, goahttp.ErrInvalidURL("resource", "VersionsByID", u.String(), err)
	}
	if ctx != nil {
		req = req.WithContext(ctx)
	}

	return req, nil
}

// DecodeVersionsByIDResponse returns a decoder for responses returned by the
// resource VersionsByID endpoint. restoreBody controls whether the response
// body should be restored after having been read.
// DecodeVersionsByIDResponse may return the following errors:
//	- "internal-error" (type *goa.ServiceError): http.StatusInternalServerError
//	- "not-found" (type *goa.ServiceError): http.StatusNotFound
//	- error: internal error
func DecodeVersionsByIDResponse(decoder func(*http.Response) goahttp.Decoder, restoreBody bool) func(*http.Response) (interface{}, error) {
	return func(resp *http.Response) (interface{}, error) {
		if restoreBody {
			b, err := ioutil.ReadAll(resp.Body)
			if err != nil {
				return nil, err
			}
			resp.Body = ioutil.NopCloser(bytes.NewBuffer(b))
			defer func() {
				resp.Body = ioutil.NopCloser(bytes.NewBuffer(b))
			}()
		} else {
			defer resp.Body.Close()
		}
		switch resp.StatusCode {
		case http.StatusOK:
			var (
				body VersionsByIDResponseBody
				err  error
			)
			err = decoder(resp).Decode(&body)
			if err != nil {
				return nil, goahttp.ErrDecodingError("resource", "VersionsByID", err)
			}
			p := NewVersionsByIDVersionsOK(&body)
			view := "default"
			vres := &resourceviews.Versions{Projected: p, View: view}
			if err = resourceviews.ValidateVersions(vres); err != nil {
				return nil, goahttp.ErrValidationError("resource", "VersionsByID", err)
			}
			res := resource.NewVersions(vres)
			return res, nil
		case http.StatusInternalServerError:
			var (
				body VersionsByIDInternalErrorResponseBody
				err  error
			)
			err = decoder(resp).Decode(&body)
			if err != nil {
				return nil, goahttp.ErrDecodingError("resource", "VersionsByID", err)
			}
			err = ValidateVersionsByIDInternalErrorResponseBody(&body)
			if err != nil {
				return nil, goahttp.ErrValidationError("resource", "VersionsByID", err)
			}
			return nil, NewVersionsByIDInternalError(&body)
		case http.StatusNotFound:
			var (
				body VersionsByIDNotFoundResponseBody
				err  error
			)
			err = decoder(resp).Decode(&body)
			if err != nil {
				return nil, goahttp.ErrDecodingError("resource", "VersionsByID", err)
			}
			err = ValidateVersionsByIDNotFoundResponseBody(&body)
			if err != nil {
				return nil, goahttp.ErrValidationError("resource", "VersionsByID", err)
			}
			return nil, NewVersionsByIDNotFound(&body)
		default:
			body, _ := ioutil.ReadAll(resp.Body)
			return nil, goahttp.ErrInvalidResponse("resource", "VersionsByID", resp.StatusCode, string(body))
		}
	}
}

// BuildByTypeNameVersionRequest instantiates a HTTP request object with method
// and path set to call the "resource" service "ByTypeNameVersion" endpoint
func (c *Client) BuildByTypeNameVersionRequest(ctx context.Context, v interface{}) (*http.Request, error) {
	var (
		type_   string
		name    string
		version string
	)
	{
		p, ok := v.(*resource.ByTypeNameVersionPayload)
		if !ok {
			return nil, goahttp.ErrInvalidType("resource", "ByTypeNameVersion", "*resource.ByTypeNameVersionPayload", v)
		}
		type_ = p.Type
		name = p.Name
		version = p.Version
	}
	u := &url.URL{Scheme: c.scheme, Host: c.host, Path: ByTypeNameVersionResourcePath(type_, name, version)}
	req, err := http.NewRequest("GET", u.String(), nil)
	if err != nil {
		return nil, goahttp.ErrInvalidURL("resource", "ByTypeNameVersion", u.String(), err)
	}
	if ctx != nil {
		req = req.WithContext(ctx)
	}

	return req, nil
}

// DecodeByTypeNameVersionResponse returns a decoder for responses returned by
// the resource ByTypeNameVersion endpoint. restoreBody controls whether the
// response body should be restored after having been read.
// DecodeByTypeNameVersionResponse may return the following errors:
//	- "internal-error" (type *goa.ServiceError): http.StatusInternalServerError
//	- "not-found" (type *goa.ServiceError): http.StatusNotFound
//	- error: internal error
func DecodeByTypeNameVersionResponse(decoder func(*http.Response) goahttp.Decoder, restoreBody bool) func(*http.Response) (interface{}, error) {
	return func(resp *http.Response) (interface{}, error) {
		if restoreBody {
			b, err := ioutil.ReadAll(resp.Body)
			if err != nil {
				return nil, err
			}
			resp.Body = ioutil.NopCloser(bytes.NewBuffer(b))
			defer func() {
				resp.Body = ioutil.NopCloser(bytes.NewBuffer(b))
			}()
		} else {
			defer resp.Body.Close()
		}
		switch resp.StatusCode {
		case http.StatusOK:
			var (
				body ByTypeNameVersionResponseBody
				err  error
			)
			err = decoder(resp).Decode(&body)
			if err != nil {
				return nil, goahttp.ErrDecodingError("resource", "ByTypeNameVersion", err)
			}
			p := NewByTypeNameVersionVersionOK(&body)
			view := "default"
			vres := &resourceviews.Version{Projected: p, View: view}
			if err = resourceviews.ValidateVersion(vres); err != nil {
				return nil, goahttp.ErrValidationError("resource", "ByTypeNameVersion", err)
			}
			res := resource.NewVersion(vres)
			return res, nil
		case http.StatusInternalServerError:
			var (
				body ByTypeNameVersionInternalErrorResponseBody
				err  error
			)
			err = decoder(resp).Decode(&body)
			if err != nil {
				return nil, goahttp.ErrDecodingError("resource", "ByTypeNameVersion", err)
			}
			err = ValidateByTypeNameVersionInternalErrorResponseBody(&body)
			if err != nil {
				return nil, goahttp.ErrValidationError("resource", "ByTypeNameVersion", err)
			}
			return nil, NewByTypeNameVersionInternalError(&body)
		case http.StatusNotFound:
			var (
				body ByTypeNameVersionNotFoundResponseBody
				err  error
			)
			err = decoder(resp).Decode(&body)
			if err != nil {
				return nil, goahttp.ErrDecodingError("resource", "ByTypeNameVersion", err)
			}
			err = ValidateByTypeNameVersionNotFoundResponseBody(&body)
			if err != nil {
				return nil, goahttp.ErrValidationError("resource", "ByTypeNameVersion", err)
			}
			return nil, NewByTypeNameVersionNotFound(&body)
		default:
			body, _ := ioutil.ReadAll(resp.Body)
			return nil, goahttp.ErrInvalidResponse("resource", "ByTypeNameVersion", resp.StatusCode, string(body))
		}
	}
}

// BuildByVersionIDRequest instantiates a HTTP request object with method and
// path set to call the "resource" service "ByVersionId" endpoint
func (c *Client) BuildByVersionIDRequest(ctx context.Context, v interface{}) (*http.Request, error) {
	var (
		versionID uint
	)
	{
		p, ok := v.(*resource.ByVersionIDPayload)
		if !ok {
			return nil, goahttp.ErrInvalidType("resource", "ByVersionId", "*resource.ByVersionIDPayload", v)
		}
		versionID = p.VersionID
	}
	u := &url.URL{Scheme: c.scheme, Host: c.host, Path: ByVersionIDResourcePath(versionID)}
	req, err := http.NewRequest("GET", u.String(), nil)
	if err != nil {
		return nil, goahttp.ErrInvalidURL("resource", "ByVersionId", u.String(), err)
	}
	if ctx != nil {
		req = req.WithContext(ctx)
	}

	return req, nil
}

// DecodeByVersionIDResponse returns a decoder for responses returned by the
// resource ByVersionId endpoint. restoreBody controls whether the response
// body should be restored after having been read.
// DecodeByVersionIDResponse may return the following errors:
//	- "internal-error" (type *goa.ServiceError): http.StatusInternalServerError
//	- "not-found" (type *goa.ServiceError): http.StatusNotFound
//	- error: internal error
func DecodeByVersionIDResponse(decoder func(*http.Response) goahttp.Decoder, restoreBody bool) func(*http.Response) (interface{}, error) {
	return func(resp *http.Response) (interface{}, error) {
		if restoreBody {
			b, err := ioutil.ReadAll(resp.Body)
			if err != nil {
				return nil, err
			}
			resp.Body = ioutil.NopCloser(bytes.NewBuffer(b))
			defer func() {
				resp.Body = ioutil.NopCloser(bytes.NewBuffer(b))
			}()
		} else {
			defer resp.Body.Close()
		}
		switch resp.StatusCode {
		case http.StatusOK:
			var (
				body ByVersionIDResponseBody
				err  error
			)
			err = decoder(resp).Decode(&body)
			if err != nil {
				return nil, goahttp.ErrDecodingError("resource", "ByVersionId", err)
			}
			p := NewByVersionIDVersionOK(&body)
			view := "default"
			vres := &resourceviews.Version{Projected: p, View: view}
			if err = resourceviews.ValidateVersion(vres); err != nil {
				return nil, goahttp.ErrValidationError("resource", "ByVersionId", err)
			}
			res := resource.NewVersion(vres)
			return res, nil
		case http.StatusInternalServerError:
			var (
				body ByVersionIDInternalErrorResponseBody
				err  error
			)
			err = decoder(resp).Decode(&body)
			if err != nil {
				return nil, goahttp.ErrDecodingError("resource", "ByVersionId", err)
			}
			err = ValidateByVersionIDInternalErrorResponseBody(&body)
			if err != nil {
				return nil, goahttp.ErrValidationError("resource", "ByVersionId", err)
			}
			return nil, NewByVersionIDInternalError(&body)
		case http.StatusNotFound:
			var (
				body ByVersionIDNotFoundResponseBody
				err  error
			)
			err = decoder(resp).Decode(&body)
			if err != nil {
				return nil, goahttp.ErrDecodingError("resource", "ByVersionId", err)
			}
			err = ValidateByVersionIDNotFoundResponseBody(&body)
			if err != nil {
				return nil, goahttp.ErrValidationError("resource", "ByVersionId", err)
			}
			return nil, NewByVersionIDNotFound(&body)
		default:
			body, _ := ioutil.ReadAll(resp.Body)
			return nil, goahttp.ErrInvalidResponse("resource", "ByVersionId", resp.StatusCode, string(body))
		}
	}
}

// BuildByTypeNameRequest instantiates a HTTP request object with method and
// path set to call the "resource" service "ByTypeName" endpoint
func (c *Client) BuildByTypeNameRequest(ctx context.Context, v interface{}) (*http.Request, error) {
	var (
		type_ string
		name  string
	)
	{
		p, ok := v.(*resource.ByTypeNamePayload)
		if !ok {
			return nil, goahttp.ErrInvalidType("resource", "ByTypeName", "*resource.ByTypeNamePayload", v)
		}
		type_ = p.Type
		name = p.Name
	}
	u := &url.URL{Scheme: c.scheme, Host: c.host, Path: ByTypeNameResourcePath(type_, name)}
	req, err := http.NewRequest("GET", u.String(), nil)
	if err != nil {
		return nil, goahttp.ErrInvalidURL("resource", "ByTypeName", u.String(), err)
	}
	if ctx != nil {
		req = req.WithContext(ctx)
	}

	return req, nil
}

// DecodeByTypeNameResponse returns a decoder for responses returned by the
// resource ByTypeName endpoint. restoreBody controls whether the response body
// should be restored after having been read.
// DecodeByTypeNameResponse may return the following errors:
//	- "internal-error" (type *goa.ServiceError): http.StatusInternalServerError
//	- "not-found" (type *goa.ServiceError): http.StatusNotFound
//	- error: internal error
func DecodeByTypeNameResponse(decoder func(*http.Response) goahttp.Decoder, restoreBody bool) func(*http.Response) (interface{}, error) {
	return func(resp *http.Response) (interface{}, error) {
		if restoreBody {
			b, err := ioutil.ReadAll(resp.Body)
			if err != nil {
				return nil, err
			}
			resp.Body = ioutil.NopCloser(bytes.NewBuffer(b))
			defer func() {
				resp.Body = ioutil.NopCloser(bytes.NewBuffer(b))
			}()
		} else {
			defer resp.Body.Close()
		}
		switch resp.StatusCode {
		case http.StatusOK:
			var (
				body ByTypeNameResponseBody
				err  error
			)
			err = decoder(resp).Decode(&body)
			if err != nil {
				return nil, goahttp.ErrDecodingError("resource", "ByTypeName", err)
			}
			p := NewByTypeNameResourceCollectionOK(body)
			view := "withoutVersion"
			vres := resourceviews.ResourceCollection{Projected: p, View: view}
			if err = resourceviews.ValidateResourceCollection(vres); err != nil {
				return nil, goahttp.ErrValidationError("resource", "ByTypeName", err)
			}
			res := resource.NewResourceCollection(vres)
			return res, nil
		case http.StatusInternalServerError:
			var (
				body ByTypeNameInternalErrorResponseBody
				err  error
			)
			err = decoder(resp).Decode(&body)
			if err != nil {
				return nil, goahttp.ErrDecodingError("resource", "ByTypeName", err)
			}
			err = ValidateByTypeNameInternalErrorResponseBody(&body)
			if err != nil {
				return nil, goahttp.ErrValidationError("resource", "ByTypeName", err)
			}
			return nil, NewByTypeNameInternalError(&body)
		case http.StatusNotFound:
			var (
				body ByTypeNameNotFoundResponseBody
				err  error
			)
			err = decoder(resp).Decode(&body)
			if err != nil {
				return nil, goahttp.ErrDecodingError("resource", "ByTypeName", err)
			}
			err = ValidateByTypeNameNotFoundResponseBody(&body)
			if err != nil {
				return nil, goahttp.ErrValidationError("resource", "ByTypeName", err)
			}
			return nil, NewByTypeNameNotFound(&body)
		default:
			body, _ := ioutil.ReadAll(resp.Body)
			return nil, goahttp.ErrInvalidResponse("resource", "ByTypeName", resp.StatusCode, string(body))
		}
	}
}

// BuildByIDRequest instantiates a HTTP request object with method and path set
// to call the "resource" service "ById" endpoint
func (c *Client) BuildByIDRequest(ctx context.Context, v interface{}) (*http.Request, error) {
	var (
		id uint
	)
	{
		p, ok := v.(*resource.ByIDPayload)
		if !ok {
			return nil, goahttp.ErrInvalidType("resource", "ById", "*resource.ByIDPayload", v)
		}
		id = p.ID
	}
	u := &url.URL{Scheme: c.scheme, Host: c.host, Path: ByIDResourcePath(id)}
	req, err := http.NewRequest("GET", u.String(), nil)
	if err != nil {
		return nil, goahttp.ErrInvalidURL("resource", "ById", u.String(), err)
	}
	if ctx != nil {
		req = req.WithContext(ctx)
	}

	return req, nil
}

// DecodeByIDResponse returns a decoder for responses returned by the resource
// ById endpoint. restoreBody controls whether the response body should be
// restored after having been read.
// DecodeByIDResponse may return the following errors:
//	- "internal-error" (type *goa.ServiceError): http.StatusInternalServerError
//	- "not-found" (type *goa.ServiceError): http.StatusNotFound
//	- error: internal error
func DecodeByIDResponse(decoder func(*http.Response) goahttp.Decoder, restoreBody bool) func(*http.Response) (interface{}, error) {
	return func(resp *http.Response) (interface{}, error) {
		if restoreBody {
			b, err := ioutil.ReadAll(resp.Body)
			if err != nil {
				return nil, err
			}
			resp.Body = ioutil.NopCloser(bytes.NewBuffer(b))
			defer func() {
				resp.Body = ioutil.NopCloser(bytes.NewBuffer(b))
			}()
		} else {
			defer resp.Body.Close()
		}
		switch resp.StatusCode {
		case http.StatusOK:
			var (
				body ByIDResponseBody
				err  error
			)
			err = decoder(resp).Decode(&body)
			if err != nil {
				return nil, goahttp.ErrDecodingError("resource", "ById", err)
			}
			p := NewByIDResourceOK(&body)
			view := "default"
			vres := &resourceviews.Resource{Projected: p, View: view}
			if err = resourceviews.ValidateResource(vres); err != nil {
				return nil, goahttp.ErrValidationError("resource", "ById", err)
			}
			res := resource.NewResource(vres)
			return res, nil
		case http.StatusInternalServerError:
			var (
				body ByIDInternalErrorResponseBody
				err  error
			)
			err = decoder(resp).Decode(&body)
			if err != nil {
				return nil, goahttp.ErrDecodingError("resource", "ById", err)
			}
			err = ValidateByIDInternalErrorResponseBody(&body)
			if err != nil {
				return nil, goahttp.ErrValidationError("resource", "ById", err)
			}
			return nil, NewByIDInternalError(&body)
		case http.StatusNotFound:
			var (
				body ByIDNotFoundResponseBody
				err  error
			)
			err = decoder(resp).Decode(&body)
			if err != nil {
				return nil, goahttp.ErrDecodingError("resource", "ById", err)
			}
			err = ValidateByIDNotFoundResponseBody(&body)
			if err != nil {
				return nil, goahttp.ErrValidationError("resource", "ById", err)
			}
			return nil, NewByIDNotFound(&body)
		default:
			body, _ := ioutil.ReadAll(resp.Body)
			return nil, goahttp.ErrInvalidResponse("resource", "ById", resp.StatusCode, string(body))
		}
	}
}

// unmarshalResourceResponseToResourceviewsResourceView builds a value of type
// *resourceviews.ResourceView from a value of type *ResourceResponse.
func unmarshalResourceResponseToResourceviewsResourceView(v *ResourceResponse) *resourceviews.ResourceView {
	res := &resourceviews.ResourceView{
		ID:     v.ID,
		Name:   v.Name,
		Type:   v.Type,
		Rating: v.Rating,
	}
	res.Catalog = unmarshalCatalogResponseToResourceviewsCatalogView(v.Catalog)
	res.LatestVersion = unmarshalVersionResponseToResourceviewsVersionView(v.LatestVersion)
	res.Tags = make([]*resourceviews.TagView, len(v.Tags))
	for i, val := range v.Tags {
		res.Tags[i] = unmarshalTagResponseToResourceviewsTagView(val)
	}
	res.Versions = make([]*resourceviews.VersionView, len(v.Versions))
	for i, val := range v.Versions {
		res.Versions[i] = unmarshalVersionResponseToResourceviewsVersionView(val)
	}

	return res
}

// unmarshalCatalogResponseToResourceviewsCatalogView builds a value of type
// *resourceviews.CatalogView from a value of type *CatalogResponse.
func unmarshalCatalogResponseToResourceviewsCatalogView(v *CatalogResponse) *resourceviews.CatalogView {
	res := &resourceviews.CatalogView{
		ID:   v.ID,
		Type: v.Type,
	}

	return res
}

// unmarshalVersionResponseToResourceviewsVersionView builds a value of type
// *resourceviews.VersionView from a value of type *VersionResponse.
func unmarshalVersionResponseToResourceviewsVersionView(v *VersionResponse) *resourceviews.VersionView {
	res := &resourceviews.VersionView{
		ID:                  v.ID,
		Version:             v.Version,
		DisplayName:         v.DisplayName,
		Description:         v.Description,
		MinPipelinesVersion: v.MinPipelinesVersion,
		RawURL:              v.RawURL,
		WebURL:              v.WebURL,
		UpdatedAt:           v.UpdatedAt,
	}
	res.Resource = unmarshalResourceResponseToResourceviewsResourceView(v.Resource)

	return res
}

// unmarshalTagResponseToResourceviewsTagView builds a value of type
// *resourceviews.TagView from a value of type *TagResponse.
func unmarshalTagResponseToResourceviewsTagView(v *TagResponse) *resourceviews.TagView {
	res := &resourceviews.TagView{
		ID:   v.ID,
		Name: v.Name,
	}

	return res
}

// unmarshalVersionResponseBodyToResourceviewsVersionView builds a value of
// type *resourceviews.VersionView from a value of type *VersionResponseBody.
func unmarshalVersionResponseBodyToResourceviewsVersionView(v *VersionResponseBody) *resourceviews.VersionView {
	res := &resourceviews.VersionView{
		ID:                  v.ID,
		Version:             v.Version,
		DisplayName:         v.DisplayName,
		Description:         v.Description,
		MinPipelinesVersion: v.MinPipelinesVersion,
		RawURL:              v.RawURL,
		WebURL:              v.WebURL,
		UpdatedAt:           v.UpdatedAt,
	}
	res.Resource = unmarshalResourceResponseBodyToResourceviewsResourceView(v.Resource)

	return res
}

// unmarshalResourceResponseBodyToResourceviewsResourceView builds a value of
// type *resourceviews.ResourceView from a value of type *ResourceResponseBody.
func unmarshalResourceResponseBodyToResourceviewsResourceView(v *ResourceResponseBody) *resourceviews.ResourceView {
	res := &resourceviews.ResourceView{
		ID:     v.ID,
		Name:   v.Name,
		Type:   v.Type,
		Rating: v.Rating,
	}
	res.Catalog = unmarshalCatalogResponseBodyToResourceviewsCatalogView(v.Catalog)
	res.LatestVersion = unmarshalVersionResponseBodyToResourceviewsVersionView(v.LatestVersion)
	res.Tags = make([]*resourceviews.TagView, len(v.Tags))
	for i, val := range v.Tags {
		res.Tags[i] = unmarshalTagResponseBodyToResourceviewsTagView(val)
	}
	res.Versions = make([]*resourceviews.VersionView, len(v.Versions))
	for i, val := range v.Versions {
		res.Versions[i] = unmarshalVersionResponseBodyToResourceviewsVersionView(val)
	}

	return res
}

// unmarshalCatalogResponseBodyToResourceviewsCatalogView builds a value of
// type *resourceviews.CatalogView from a value of type *CatalogResponseBody.
func unmarshalCatalogResponseBodyToResourceviewsCatalogView(v *CatalogResponseBody) *resourceviews.CatalogView {
	res := &resourceviews.CatalogView{
		ID:   v.ID,
		Type: v.Type,
	}

	return res
}

// unmarshalTagResponseBodyToResourceviewsTagView builds a value of type
// *resourceviews.TagView from a value of type *TagResponseBody.
func unmarshalTagResponseBodyToResourceviewsTagView(v *TagResponseBody) *resourceviews.TagView {
	res := &resourceviews.TagView{
		ID:   v.ID,
		Name: v.Name,
	}

	return res
}

// unmarshalByTypeNameVersionResponseBodyToResourceviewsVersionView builds a
// value of type *resourceviews.VersionView from a value of type
// *ByTypeNameVersionResponseBody.
func unmarshalByTypeNameVersionResponseBodyToResourceviewsVersionView(v *ByTypeNameVersionResponseBody) *resourceviews.VersionView {
	res := &resourceviews.VersionView{
		ID:                  v.ID,
		Version:             v.Version,
		DisplayName:         v.DisplayName,
		Description:         v.Description,
		MinPipelinesVersion: v.MinPipelinesVersion,
		RawURL:              v.RawURL,
		WebURL:              v.WebURL,
		UpdatedAt:           v.UpdatedAt,
	}
	res.Resource = unmarshalResourceResponseBodyToResourceviewsResourceView(v.Resource)

	return res
}

// unmarshalByVersionIDResponseBodyToResourceviewsVersionView builds a value of
// type *resourceviews.VersionView from a value of type
// *ByVersionIDResponseBody.
func unmarshalByVersionIDResponseBodyToResourceviewsVersionView(v *ByVersionIDResponseBody) *resourceviews.VersionView {
	res := &resourceviews.VersionView{
		ID:                  v.ID,
		Version:             v.Version,
		DisplayName:         v.DisplayName,
		Description:         v.Description,
		MinPipelinesVersion: v.MinPipelinesVersion,
		RawURL:              v.RawURL,
		WebURL:              v.WebURL,
		UpdatedAt:           v.UpdatedAt,
	}
	res.Resource = unmarshalResourceResponseBodyToResourceviewsResourceView(v.Resource)

	return res
}

// unmarshalByIDResponseBodyToResourceviewsResourceView builds a value of type
// *resourceviews.ResourceView from a value of type *ByIDResponseBody.
func unmarshalByIDResponseBodyToResourceviewsResourceView(v *ByIDResponseBody) *resourceviews.ResourceView {
	res := &resourceviews.ResourceView{
		ID:     v.ID,
		Name:   v.Name,
		Type:   v.Type,
		Rating: v.Rating,
	}
	res.Catalog = unmarshalCatalogResponseBodyToResourceviewsCatalogView(v.Catalog)
	res.LatestVersion = unmarshalVersionResponseBodyToResourceviewsVersionView(v.LatestVersion)
	res.Tags = make([]*resourceviews.TagView, len(v.Tags))
	for i, val := range v.Tags {
		res.Tags[i] = unmarshalTagResponseBodyToResourceviewsTagView(val)
	}
	res.Versions = make([]*resourceviews.VersionView, len(v.Versions))
	for i, val := range v.Versions {
		res.Versions[i] = unmarshalVersionResponseBodyToResourceviewsVersionView(val)
	}

	return res
}
