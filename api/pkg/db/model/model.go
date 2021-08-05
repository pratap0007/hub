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

package model

import (
	"time"

	"gorm.io/gorm"
)

type (
	Category struct {
		gorm.Model
		Name      string      `gorm:"not null;unique"`
		Resources []*Resource `gorm:"many2many:resource_categories;constraint:OnDelete:CASCADE;"`
	}

	Tag struct {
		gorm.Model
		Name      string      `gorm:"not null;unique"`
		Resources []*Resource `gorm:"many2many:resource_tags;constraint:OnDelete:CASCADE;"`
	}

	Catalog struct {
		gorm.Model
		Name       string `gorm:"uniqueIndex:uix_name_org"`
		Org        string `gorm:"uniqueIndex:uix_name_org"`
		Type       string `gorm:"not null;default:null"`
		URL        string `gorm:"not null;default:null"`
		Revision   string `gorm:"not null;default:null"`
		ContextDir string
		SHA        string
		Resources  []Resource     `gorm:"constraint:OnDelete:CASCADE;"`
		Errors     []CatalogError `gorm:"constraint:OnDelete:CASCADE;"`
	}

	CatalogError struct {
		gorm.Model
		Catalog   Catalog `gorm:"constraint:OnDelete:CASCADE;"`
		CatalogID uint
		Type      string
		Detail    string
	}

	Resource struct {
		gorm.Model
		Name       string `gorm:"not null;default:null"`
		Kind       string `gorm:"not null;default:null"`
		Rating     float64
		Catalog    Catalog     `gorm:"constraint:OnDelete:CASCADE;"`
		Categories []*Category `gorm:"many2many:resource_categories;constraint:OnDelete:CASCADE;"`
		CatalogID  uint
		Versions   []ResourceVersion `gorm:"constraint:OnDelete:CASCADE;"`
		Tags       []*Tag            `gorm:"many2many:resource_tags;constraint:OnDelete:CASCADE;"`
	}

	ResourceVersion struct {
		gorm.Model
		Version             string `gorm:"not null;default:null"`
		Description         string
		URL                 string `gorm:"not null;default:null"`
		DisplayName         string
		MinPipelinesVersion string   `gorm:"not null;default:null"`
		Resource            Resource `gorm:"constraint:OnDelete:CASCADE;"`
		ResourceID          uint
		ModifiedAt          time.Time
	}

	ResourceTag struct {
		ResourceID uint
		TagID      uint
	}

	ResourceCategory struct {
		ResourceID uint
		CategoryID uint
	}

	User struct {
		gorm.Model
		AgentName            string
		GithubLogin          string
		GithubName           string
		Type                 UserType
		Scopes               []*Scope `gorm:"many2many:user_scopes;constraint:OnDelete:CASCADE;"`
		RefreshTokenChecksum string
		AvatarURL            string
	}

	Scope struct {
		gorm.Model
		Name string `gorm:"not null;unique"`
	}

	UserResourceRating struct {
		gorm.Model
		UserID     uint
		User       User     `gorm:"constraint:OnDelete:CASCADE;"`
		Resource   Resource `gorm:"constraint:OnDelete:CASCADE;"`
		ResourceID uint
		Rating     uint `gorm:"not null;default:null"`
	}

	UserScope struct {
		UserID  uint
		ScopeID uint
	}

	Config struct {
		gorm.Model
		Checksum string
	}
)

type UserType string

// Types of Users
const (
	NormalUserType UserType = "user"
	AgentUserType  UserType = "agent"
)
