package hub

import (
	"context"
	"fmt"
	"github.com/jinzhu/gorm"
	"go.uber.org/zap"
	"strings"

	resourceversions "github.com/tektoncd/hub/api/gen/resourceversions"
	app "github.com/tektoncd/hub/api/pkg/app"
	"github.com/tektoncd/hub/api/pkg/db/model"
)

// resourceversions service example implementation.
// The example methods log the requests and return zero values.
type resourceversionssrvc struct {
	logger *zap.SugaredLogger
	db     *gorm.DB
}

// NewResourceversions returns the resourceversions service implementation.
func NewResourceversions(api *app.ApiConfig) resourceversions.Service {
	return &resourceversionssrvc{api.Logger(), api.DB()}
}

// Get all versions information of a resource by resourceId
func (s *resourceversionssrvc) Resourceversionsdetail(ctx context.Context, p *resourceversions.ResourceID) (res []*resourceversions.Resourceversion, err error) {
	s.logger.Infof("resourceversions.Resourceversionsdetail")

	var all []*model.ResourceVersion
	if err := s.db.Order("id").Where("resource_id = ?", p.ResourceID).Find(&all).Error; err != nil {
		s.logger.Error(err)
		return []*resourceversions.Resourceversion{}, resourceversions.MakeInternalError(fmt.Errorf("Failed to fetch versions information"))

	}
	var versionlist []*resourceversions.ResourceVersionInfo
	for _, r := range all {
		versionlist = append(versionlist, &resourceversions.ResourceVersionInfo{
			Version:     r.Version,
			DisplayName: r.DisplayName,
			ID:          r.ID,
			Description: r.Description,
			WebURL:      r.URL,
			UpdatedAt:   r.UpdatedAt.String(),
			RawURL: strings.NewReplacer("github.com", "raw.githubusercontent.com",
				"/tree/", "/").Replace(r.URL),
		})

	}

	var resource []*model.Resource

	if err := s.db.Preload("Catalog").
		Preload("Versions", func(db *gorm.DB) *gorm.DB {
			return db.Order("resource_versions.id ASC")
		}).
		Preload("Tags").Where("id = ?", p.ResourceID).
		Find(&resource).Error; err != nil {
		return []*resourceversions.Resourceversion{}, resourceversions.MakeInternalError(fmt.Errorf("Failed to fetch resource with id %v", p.ResourceID))
	}
	tags := []*resourceversions.Tag{}
	for _, r := range resource {
		for _, t := range r.Tags {
			tags = append(tags, &resourceversions.Tag{
				ID:   t.ID,
				Name: t.Name,
			})
		}
	}

	res = append(res, &resourceversions.Resourceversion{
		ID:       resource[0].ID,
		Name:     resource[0].Name,
		Type:     resource[0].Type,
		Catalog:  &resourceversions.Catalog{ID: resource[0].Catalog.ID, Type: resource[0].Catalog.Type},
		Tags:     tags,
		Versions: versionlist,
	})

	return res, nil

}
