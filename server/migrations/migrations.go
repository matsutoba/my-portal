// Package migrations embeds the SQL migration files so they ship inside the
// compiled binary (no separate migrate CLI or file bundle needed at deploy time).
package migrations

import "embed"

//go:embed *.sql
var FS embed.FS
