package models

import "time"

// Post: 簡易CMSの記事
type Post struct {
	ID         uint      `gorm:"column:id;primaryKey" json:"id"`
	CategoryID uint      `gorm:"column:category_id;not null" json:"categoryId"`
	Category   *Category `gorm:"foreignKey:CategoryID" json:"category,omitempty"`
	Title      string    `gorm:"column:title;size:255;not null" json:"title"`
	Slug       string    `gorm:"column:slug;size:255;uniqueIndex;not null" json:"slug"`
	Content    string    `gorm:"column:content;type:longtext;not null" json:"content"`
	CreatedAt  time.Time `gorm:"column:created_at" json:"createdAt"`
	UpdatedAt  time.Time `gorm:"column:updated_at" json:"updatedAt"`
}

// Post 構造体は simple_cms_posts テーブルにマッピングされる
func (Post) TableName() string {
	return "simple_cms_posts"
}
