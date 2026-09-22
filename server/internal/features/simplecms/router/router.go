// Package router は simple cms feature の repository・service・
// controller を組み立て、ルートを登録する。
package router

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/matsutoba/my-portal/server/internal/features/simplecms/controller"
	"github.com/matsutoba/my-portal/server/internal/features/simplecms/repository"
	"github.com/matsutoba/my-portal/server/internal/features/simplecms/service"
)

// SetupSimpleCmsRoutes は simple cms feature のルートをapiGroup配下に
// 登録する（例: GET /api/simple-cms/posts）。
//
// TODO: 更新・削除は本来オーナーのみが実行できるべきだが、管理者認証の設計は
// 未着手。認証を実装するまでは他featureと同じくREAD_ONLY（本番）でのみ全操作
// をブロックする状態になっている。
func SetupSimpleCmsRoutes(apiGroup *gin.RouterGroup, db *gorm.DB) {
	categoryRepo := repository.NewCategoryRepository(db)
	postRepo := repository.NewPostRepository(db)

	categorySvc := service.NewCategoryService(categoryRepo)
	postSvc := service.NewPostService(postRepo, categoryRepo)

	categoryCtrl := controller.NewCategoryController(categorySvc)
	postCtrl := controller.NewPostController(postSvc)

	cms := apiGroup.Group("/simple-cms")
	{
		categories := cms.Group("/categories")
		{
			categories.GET("", categoryCtrl.List())
			categories.POST("", categoryCtrl.Create())
			categories.PUT("/:id", categoryCtrl.Update())
			categories.DELETE("/:id", categoryCtrl.Delete())
		}

		posts := cms.Group("/posts")
		{
			posts.GET("", postCtrl.List())
			posts.GET("/:slug", postCtrl.GetBySlug())
			posts.POST("", postCtrl.Create())
			posts.PUT("/:id", postCtrl.Update())
			posts.DELETE("/:id", postCtrl.Delete())
		}
	}
}
