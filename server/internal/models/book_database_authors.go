package models

import "time"

// Author: 著者
type Author struct {
	ID        int64     `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	Name      string    `gorm:"column:name;size:255;not null;index" json:"name"`
	NameKana  *string   `gorm:"column:name_kana;size:255" json:"nameKana,omitempty"`
	CreatedAt time.Time `gorm:"column:created_at" json:"createdAt"`
	UpdatedAt time.Time `gorm:"column:updated_at" json:"updatedAt"`
}

// Author 構造体は book_database_authors テーブルにマッピングされることを明示する
func (Author) TableName() string {
	return "book_database_authors"
}
