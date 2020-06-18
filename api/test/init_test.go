package hub

import (
	"fmt"
	"os"
	"testing"

	"github.com/jinzhu/gorm"
	app "github.com/tektoncd/hub/api/pkg/app"
	"github.com/tektoncd/hub/api/pkg/db/model"
)

var (
	db         *gorm.DB
	testConfig *app.ApiConfig
)

//this test initialize test db for goa test
func TestMain(m *testing.M) {
	var err error
	testConfig, err = app.TestConfigFromEnv()
	if err != nil {
		fmt.Fprintf(os.Stderr, "FATAL: failed to initialise: %s", err)
		os.Exit(1)
	}

	db = testConfig.DB()

	db.AutoMigrate(model.Category{}, model.Tag{})
	defer os.Exit(m.Run())
	defer testConfig.Cleanup()
}
