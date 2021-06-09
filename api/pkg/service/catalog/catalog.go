// Copyright © 2020 The Tekton Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package catalog

import (
	"context"
	"fmt"
	"time"

	"github.com/tektoncd/hub/api/gen/catalog"
	"github.com/tektoncd/hub/api/pkg/app"
	"github.com/tektoncd/hub/api/pkg/db/model"
	"github.com/tektoncd/hub/api/pkg/service/auth"
	"gorm.io/gorm"
)

type service struct {
	*auth.Service
	wq *syncer
}

var (
	internalError = catalog.MakeInternalError(fmt.Errorf("failed to refresh catalog"))
	fetchError    = catalog.MakeInternalError(fmt.Errorf("failed to fetch catalog errors"))
)

// New returns the catalog service implementation.
func New(api app.Config) catalog.Service {
	svc := auth.NewService(api, "catalog")
	wq := newSyncer(api)

	// start running after some delay to allow for all services to mount
	time.AfterFunc(3*time.Second, wq.Run)

	s := &service{
		svc,
		wq,
	}
	return s
}

// refresh the catalog for new resources
func (s *service) Refresh(ctx context.Context, p *catalog.RefreshPayload) (*catalog.Job, error) {

	log := s.Logger(ctx)
	db := s.DB(ctx)

	ctg := model.Catalog{}
	if err := db.Where(&model.Catalog{Name: p.CatalogName}).Model(&model.Catalog{}).First(&ctg).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, catalogNotFoundErr(p.CatalogName)
		}
		log.Error(err)
		return nil, internalError
	}

	log.Infof("going to enqueue")

	job, err := s.wq.Enqueue(auth.UserID(ctx), ctg.ID)
	if err != nil {
		return nil, err
	}

	ret := &catalog.Job{ID: job.ID, CatalogName: ctg.Name, Status: job.Status}
	log.Infof("job %d queued for refresh", job.ID)

	return ret, nil
}

// refresh all catalog for new resources
func (s *service) RefreshAll(ctx context.Context, p *catalog.RefreshAllPayload) ([]*catalog.Job, error) {

	log := s.Logger(ctx)
	db := s.DB(ctx)

	ctgs := []model.Catalog{}
	if err := db.Find(&ctgs).Error; err != nil {
		log.Error(err)
		return nil, internalError
	}

	var res []*catalog.Job
	for _, ctg := range ctgs {
		job, err := s.wq.Enqueue(auth.UserID(ctx), ctg.ID)
		if err != nil {
			return nil, err
		}

		log.Infof("job %d queued to refresh catalog %s", job.ID, ctg.Name)

		ret := &catalog.Job{ID: job.ID, CatalogName: ctg.Name, Status: job.Status}
		res = append(res, ret)
	}

	return res, nil
}

// List all errors occurred refreshing a catalog
func (s *service) CatalogError(ctx context.Context, p *catalog.CatalogErrorPayload) (*catalog.CatalogErrorResult, error) {

	log := s.Logger(ctx)
	db := s.DB(ctx)

	ctg := model.Catalog{}
	if err := db.Where(&model.Catalog{Name: p.CatalogName}).First(&ctg).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, catalogNotFoundErr(p.CatalogName)
		}
		log.Error(err)
		return nil, internalError
	}

	allCtgError := []model.CatalogError{}
	if err := db.Where(&model.CatalogError{CatalogID: ctg.ID}).Order("id").Find(&allCtgError).Error; err != nil {
		log.Error(err)
		return nil, fetchError
	}

	// rs := map[string][]string{}
	a := []string{}
	b := []string{}
	c := []string{}

	for _, item := range allCtgError {
		switch item.Type {
		case "info":
			a = append(a, item.Detail)
		case "warning":
			b = append(b, item.Detail)
		case "critical":
			c = append(c, item.Detail)
			// case "info", "warning", "critical":
			// 	rs[item.Type] = append(rs[item.Type], item.Detail)
			// default:
			// 	rs["unknown"] = append(rs["unknown"], item.Detail)
		}
	}

	allError := []*catalog.CatalogErrors{}

	// for key, element := range rs {
	if len(a) > 0 {
		allError = append(allError, &catalog.CatalogErrors{Type: "info", Errors: a})
	}
	if len(b) > 0 {
		allError = append(allError, &catalog.CatalogErrors{Type: "warning", Errors: b})
	}
	if len(c) > 0 {
		allError = append(allError, &catalog.CatalogErrors{Type: "critical", Errors: c})
	}
	// }

	return &catalog.CatalogErrorResult{Data: allError}, nil
}

func catalogNotFoundErr(name string) error {
	return catalog.MakeNotFound(fmt.Errorf("%s catalog not found", name))
}
