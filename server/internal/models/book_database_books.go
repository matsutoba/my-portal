package models

import "time"

// Book: 書籍
type Book struct {
	ID            int64      `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	ISBN13        *string    `gorm:"column:isbn13;size:13;uniqueIndex" json:"isbn13,omitempty"`
	Title         string     `gorm:"column:title;size:512;not null" json:"title"`
	Subtitle      *string    `gorm:"column:subtitle;size:512" json:"subtitle,omitempty"`
	PublisherID   *int64     `gorm:"column:publisher_id" json:"publisherId,omitempty"`
	PublishedDate *time.Time `gorm:"column:published_date;type:date" json:"publishedDate,omitempty"`
	SeriesName    *string    `gorm:"column:series_name;size:255" json:"seriesName,omitempty"`
	Volume        *string    `gorm:"column:volume;size:50" json:"volume,omitempty"`
	Price         *int       `gorm:"column:price" json:"price,omitempty"`
	CoverImageURL *string    `gorm:"column:cover_image_url;size:1024" json:"coverImageUrl,omitempty"`
	Description   *string    `gorm:"column:description" json:"description,omitempty"`
	CreatedAt     time.Time  `gorm:"column:created_at" json:"createdAt"`
	UpdatedAt     time.Time  `gorm:"column:updated_at" json:"updatedAt"`

	// Publisher: リレーション（出版社）
	Publisher *Publisher `gorm:"foreignKey:PublisherID" json:"publisher,omitempty"`

	// BookAuthors: リレーション（著者との中間テーブル）- 表示順は BookAuthor.Order
	BookAuthors []BookAuthor `gorm:"foreignKey:BookID" json:"bookAuthors,omitempty"`
}

// Book 構造体は book_database_books テーブルにマッピングされることを明示する
func (Book) TableName() string {
	return "book_database_books"
}
