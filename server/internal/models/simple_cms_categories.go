package models

import "time"

// Category: SimpleCMSの記事カテゴリ
type Category struct {
	ID        uint      `gorm:"column:id;primaryKey" json:"id"`
	Name      string    `gorm:"column:name;size:100;not null" json:"name"`
	Slug      string    `gorm:"column:slug;size:100;uniqueIndex;not null" json:"slug"`
	CreatedAt time.Time `gorm:"column:created_at" json:"createdAt"`
	UpdatedAt time.Time `gorm:"column:updated_at" json:"updatedAt"`
}

// Category 構造体は simple_cms_categories テーブルにマッピングされる
func (Category) TableName() string {
	return "simple_cms_categories"
}
