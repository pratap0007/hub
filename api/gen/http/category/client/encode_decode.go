// Code generated by goa v3.1.3, DO NOT EDIT.
//
// category HTTP client encoders and decoders
//
// Command:
// $ goa gen github.com/tektoncd/hub/api/design

package client

import (
	"bytes"
	"context"
	"io/ioutil"
	"net/http"
	"net/url"

	category "github.com/tektoncd/hub/api/gen/category"
	goahttp "goa.design/goa/v3/http"
	goa "goa.design/goa/v3/pkg"
)

// BuildAllRequest instantiates a HTTP request object with method and path set
// to call the "category" service "All" endpoint
func (c *Client) BuildAllRequest(ctx context.Context, v interface{}) (*http.Request, error) {
	u := &url.URL{Scheme: c.scheme, Host: c.host, Path: AllCategoryPath()}
	req, err := http.NewRequest("GET", u.String(), nil)
	if err != nil {
		return nil, goahttp.ErrInvalidURL("category", "All", u.String(), err)
	}
	if ctx != nil {
		req = req.WithContext(ctx)
	}

	return req, nil
}

// DecodeAllResponse returns a decoder for responses returned by the category
// All endpoint. restoreBody controls whether the response body should be
// restored after having been read.
// DecodeAllResponse may return the following errors:
//	- "internal-error" (type *goa.ServiceError): http.StatusInternalServerError
//	- error: internal error
func DecodeAllResponse(decoder func(*http.Response) goahttp.Decoder, restoreBody bool) func(*http.Response) (interface{}, error) {
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
				body AllResponseBody
				err  error
			)
			err = decoder(resp).Decode(&body)
			if err != nil {
				return nil, goahttp.ErrDecodingError("category", "All", err)
			}
			for _, e := range body {
				if e != nil {
					if err2 := ValidateCategoryResponse(e); err2 != nil {
						err = goa.MergeErrors(err, err2)
					}
				}
			}
			if err != nil {
				return nil, goahttp.ErrValidationError("category", "All", err)
			}
			res := NewAllCategoryOK(body)
			return res, nil
		case http.StatusInternalServerError:
			var (
				body AllInternalErrorResponseBody
				err  error
			)
			err = decoder(resp).Decode(&body)
			if err != nil {
				return nil, goahttp.ErrDecodingError("category", "All", err)
			}
			err = ValidateAllInternalErrorResponseBody(&body)
			if err != nil {
				return nil, goahttp.ErrValidationError("category", "All", err)
			}
			return nil, NewAllInternalError(&body)
		default:
			body, _ := ioutil.ReadAll(resp.Body)
			return nil, goahttp.ErrInvalidResponse("category", "All", resp.StatusCode, string(body))
		}
	}
}

// unmarshalCategoryResponseToCategoryCategory builds a value of type
// *category.Category from a value of type *CategoryResponse.
func unmarshalCategoryResponseToCategoryCategory(v *CategoryResponse) *category.Category {
	res := &category.Category{
		ID:   *v.ID,
		Name: *v.Name,
	}
	res.Tags = make([]*category.Tag, len(v.Tags))
	for i, val := range v.Tags {
		res.Tags[i] = unmarshalTagResponseToCategoryTag(val)
	}

	return res
}

// unmarshalTagResponseToCategoryTag builds a value of type *category.Tag from
// a value of type *TagResponse.
func unmarshalTagResponseToCategoryTag(v *TagResponse) *category.Tag {
	res := &category.Tag{
		ID:   *v.ID,
		Name: *v.Name,
	}

	return res
}
