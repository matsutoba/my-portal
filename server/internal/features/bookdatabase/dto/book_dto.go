// Package dto は book database feature のHTTP APIにおけるリクエスト/レスポンス型を定義する。
// service層がこれを組み立ててcontrollerに返す。
package dto

import "time"

// BookResponse は GET /api/books が返す書籍1件分。
type BookResponse struct {
	ID            int64      `json:"id"`
	Title         string     `json:"title"`
	Subtitle      *string    `json:"subtitle"`
	Authors       []string   `json:"authors"`
	PublisherName *string    `json:"publisherName"`
	PublishedDate *time.Time `json:"publishedDate"`
	CoverImageURL *string    `json:"coverImageUrl"`
}

// ListBooksResponse は GET /api/books のレスポンスボディ。
type ListBooksResponse struct {
	Books   []BookResponse `json:"books"`
	HasMore bool           `json:"hasMore"`
}

// SyncSummaryResponse は1回のsync実行結果を表す。
type SyncSummaryResponse struct {
	YearMonth       string `json:"yearMonth"`
	NDC             string `json:"ndc"`
	NumberOfRecords int    `json:"numberOfRecords"`
	Fetched         int    `json:"fetched"`
	Created         int    `json:"created"`
	Updated         int    `json:"updated"`
	Skipped         int    `json:"skipped"`
}
