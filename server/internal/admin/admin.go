// Package admin はポートフォリオ共通の管理者ログインを提供する。
// featureをまたいで使う想定のため internal/features/ の配下ではなく、
// internal/db/ 等と同様のfeature非依存の場所に置く。
package admin

import (
	"crypto/hmac"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/hex"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

const sessionCookieName = "portal_admin_session"
const sessionTTL = 7 * 24 * time.Hour

type Controller interface {
	Login() gin.HandlerFunc
	Logout() gin.HandlerFunc
	Session() gin.HandlerFunc
}

type controller struct{}

func NewController() Controller {
	return &controller{}
}

type loginRequest struct {
	Password string `json:"password" binding:"required"`
}

func (ctrl *controller) Login() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req loginRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "パスワードが違います"})
			return
		}

		password := os.Getenv("ADMIN_PASSWORD")
		if password == "" || subtle.ConstantTimeCompare([]byte(req.Password), []byte(password)) != 1 {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "パスワードが違います"})
			return
		}

		setCookie(c, signSession(password))
		c.JSON(http.StatusOK, gin.H{"isAdmin": true})
	}
}

func (ctrl *controller) Logout() gin.HandlerFunc {
	return func(c *gin.Context) {
		clearCookie(c)
		c.Status(http.StatusNoContent)
	}
}

func (ctrl *controller) Session() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"isAdmin": isValidSession(c)})
	}
}

// AuthMiddleware は管理者セッションCookieを要求する。各featureの書き込み系
// ルートに付与して使う（例: simple-cmsの記事・カテゴリの作成/更新/削除）。
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		if !isValidSession(c) {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "管理者のみ実行できます"})
			return
		}
		c.Next()
	}
}

func isValidSession(c *gin.Context) bool {
	password := os.Getenv("ADMIN_PASSWORD")
	if password == "" {
		return false
	}
	cookie, err := c.Cookie(sessionCookieName)
	if err != nil || cookie == "" {
		return false
	}
	return verifySession(cookie, password)
}

func signSession(password string) string {
	payload := strconv.FormatInt(time.Now().Add(sessionTTL).Unix(), 10)
	return payload + "." + hmacHex(payload, password)
}

func verifySession(token, password string) bool {
	payload, signature, ok := strings.Cut(token, ".")
	if !ok {
		return false
	}
	if !hmac.Equal([]byte(signature), []byte(hmacHex(payload, password))) {
		return false
	}

	expiresAt, err := strconv.ParseInt(payload, 10, 64)
	if err != nil {
		return false
	}
	return time.Now().Unix() < expiresAt
}

func hmacHex(payload, key string) string {
	mac := hmac.New(sha256.New, []byte(key))
	mac.Write([]byte(payload))
	return hex.EncodeToString(mac.Sum(nil))
}

func secureCookie() bool {
	return gin.Mode() == gin.ReleaseMode
}

func setCookie(c *gin.Context, token string) {
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie(sessionCookieName, token, int(sessionTTL.Seconds()), "/", "", secureCookie(), true)
}

func clearCookie(c *gin.Context) {
	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie(sessionCookieName, "", -1, "/", "", secureCookie(), true)
}
