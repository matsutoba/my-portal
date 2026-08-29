package models

// BookAuthor: 書籍と著者の中間テーブル（著者の役割・表示順を保持する）
type BookAuthor struct {
	BookID   int64   `gorm:"column:book_id;primaryKey" json:"bookId"`
	AuthorID int64   `gorm:"column:author_id;primaryKey" json:"authorId"`
	Role     *string `gorm:"column:role;size:50" json:"role,omitempty"`
	Order    int     `gorm:"column:order;not null;default:0" json:"order"`

	// Author: リレーション（著者）
	Author *Author `gorm:"foreignKey:AuthorID" json:"author,omitempty"`
}

// BookAuthor 構造体は book_database_book_authors テーブルにマッピングされることを明示する
func (BookAuthor) TableName() string {
	return "book_database_book_authors"
}
