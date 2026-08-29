// Package db opens the shared GORM connection.
package db

import (
	"log"
	"os"
	"strings"
	"time"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// Open connects using a DATABASE_URL of the form
// "mysql://user:password@tcp(host:port)/dbname" (same value used by
// server/cmd/migrate).
func Open(databaseURL string) (*gorm.DB, error) {
	dsn := toDSN(databaseURL)
	return gorm.Open(mysql.Open(dsn), &gorm.Config{Logger: newLogger()})
}

// newLogger mirrors GORM's default logger, except it doesn't log
// gorm.ErrRecordNotFound as an error: find-or-create lookups (e.g.
// resolving a publisher/author by name) routinely miss, and the caller
// already handles that as a normal not-found result.
func newLogger() logger.Interface {
	return logger.New(log.New(os.Stdout, "\r\n", log.LstdFlags), logger.Config{
		SlowThreshold:             200 * time.Millisecond,
		LogLevel:                  logger.Warn,
		IgnoreRecordNotFoundError: true,
		Colorful:                  true,
	})
}

// toDSN strips the "mysql://" scheme go-sql-driver doesn't expect, ensures
// parseTime is enabled so DATETIME columns scan into time.Time, and pins the
// connection charset to utf8mb4 (without it the connection can negotiate a
// different charset and mangle non-ASCII text on read/write).
func toDSN(databaseURL string) string {
	dsn := strings.TrimPrefix(databaseURL, "mysql://")
	sep := "?"
	if strings.Contains(dsn, "?") {
		sep = "&"
	}
	return dsn + sep + "parseTime=true&charset=utf8mb4"
}
