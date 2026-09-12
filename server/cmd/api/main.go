package main

import (
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"

	"github.com/matsutoba/my-portal/server/internal/db"
	bookdatabaserouter "github.com/matsutoba/my-portal/server/internal/features/bookdatabase/router"
	simpleledgerrouter "github.com/matsutoba/my-portal/server/internal/features/simpleledger/router"
)

func main() {
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		log.Fatal("DATABASE_URL is required")
	}

	conn, err := db.Open(databaseURL)
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	sqlDB, err := conn.DB()
	if err != nil {
		log.Fatalf("failed to get underlying sql.DB: %v", err)
	}
	defer sqlDB.Close()

	allowedOrigin := os.Getenv("ALLOWED_ORIGIN")
	if allowedOrigin == "" {
		allowedOrigin = "http://localhost:3000"
	}

	readOnly := isReadOnly(os.Getenv("READ_ONLY"))
	if readOnly {
		log.Print("READ_ONLY is enabled: write requests will be rejected")
	}

	engine := gin.Default()
	engine.Use(corsMiddleware(allowedOrigin))
	// /api/books/sync はcron等からしか叩かれない（CronAuthMiddlewareで別途保護
	// されている）バッチ更新なので、ユーザー操作を止めるREAD_ONLYの対象外にする。
	engine.Use(readOnlyMiddleware(readOnly, "/api/books/sync"))

	engine.GET("/health", handleHealth)
	bookdatabaserouter.SetupBookRoutes(engine.Group("/api"), conn)
	simpleledgerrouter.SetupSimpleLedgerRoutes(engine.Group("/api"), conn)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("listening on :%s", port)
	if err := engine.Run(":" + port); err != nil {
		log.Printf("server exited: %v", err)
	}
}

func corsMiddleware(allowedOrigin string) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", allowedOrigin)
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}

func handleHealth(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

// isReadOnly parses the READ_ONLY env var. Any value other than "true" or
// "1" (case-insensitive) is treated as disabled.
func isReadOnly(value string) bool {
	switch strings.ToLower(value) {
	case "true", "1":
		return true
	default:
		return false
	}
}

// readOnlyMiddleware rejects write requests across the whole API when
// enabled, so a public demo deployment can't have its seed data mutated by
// visitors. GET/HEAD/OPTIONS (and CORS preflight, already handled by
// corsMiddleware) always pass through, as does any route listed in
// exemptPaths — for routes that write but aren't triggered by a user (e.g. a
// cron-only sync job gated by its own auth).
func readOnlyMiddleware(enabled bool, exemptPaths ...string) gin.HandlerFunc {
	exempt := make(map[string]bool, len(exemptPaths))
	for _, path := range exemptPaths {
		exempt[path] = true
	}

	return func(c *gin.Context) {
		if !enabled || exempt[c.FullPath()] {
			c.Next()
			return
		}

		switch c.Request.Method {
		case http.MethodGet, http.MethodHead, http.MethodOptions:
			c.Next()
		default:
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
				"error": "読み取り専用デモのため、この操作は無効です",
			})
		}
	}
}
