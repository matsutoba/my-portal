package models

import "time"

// Publisher: 出版社
type Publisher struct {
	ID        int64     `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	Name      string    `gorm:"column:name;size:255;not null;uniqueIndex" json:"name"`
	CreatedAt time.Time `gorm:"column:created_at" json:"createdAt"`
	UpdatedAt time.Time `gorm:"column:updated_at" json:"updatedAt"`
}

// Publisher 構造体は book_database_publishers テーブルにマッピングされることを明示する
func (Publisher) TableName() string {
	return "book_database_publishers"
}
