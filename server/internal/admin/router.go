package admin

import "github.com/gin-gonic/gin"

// RegisterRoutes はポートフォリオ共通の管理者ログインAPIを登録する
// （POST /api/admin/login, POST /api/admin/logout, GET /api/admin/session）。
func RegisterRoutes(apiGroup *gin.RouterGroup) {
	ctrl := NewController()

	admin := apiGroup.Group("/admin")
	{
		admin.POST("/login", ctrl.Login())
		admin.POST("/logout", ctrl.Logout())
		admin.GET("/session", ctrl.Session())
	}
}
