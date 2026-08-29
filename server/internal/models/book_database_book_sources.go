package models

import "time"

// SourceType: 書籍データの取得元
type SourceType string

const (
	SourceTypeNDLJapaneseBooks SourceType = "NDL_JAPANESE_BOOKS"
	SourceTypeNDLSearchAPI     SourceType = "NDL_SEARCH_API"
	SourceTypeJPROBooks        SourceType = "JPRO_BOOKS"
	SourceTypePublisher        SourceType = "PUBLISHER"
)

// BookSource: 書籍データを取得した外部ソースの記録（同じソースからの再取得を検出するために使う）
type BookSource struct {
	ID         int64      `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	SourceType SourceType `gorm:"column:source_type;not null" json:"sourceType"`
	SourceID   string     `gorm:"column:source_id;size:255;not null" json:"sourceId"`
	BookID     int64      `gorm:"column:book_id;not null;index" json:"bookId"`
	RawData    []byte     `gorm:"column:raw_data;type:json;not null" json:"-"`
	FetchedAt  time.Time  `gorm:"column:fetched_at;not null" json:"fetchedAt"`
	CreatedAt  time.Time  `gorm:"column:created_at" json:"createdAt"`
	UpdatedAt  time.Time  `gorm:"column:updated_at" json:"updatedAt"`
}

// BookSource 構造体は book_database_book_sources テーブルにマッピングされることを明示する
func (BookSource) TableName() string {
	return "book_database_book_sources"
}
