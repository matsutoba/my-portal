package models

import "time"

// AccountType は勘定科目区分（資産・負債・純資産・収益・費用）を表す。
type AccountType string

const (
	AssetAccount     AccountType = "asset"
	LiabilityAccount AccountType = "liability"
	EquityAccount    AccountType = "equity"
	RevenueAccount   AccountType = "revenue"
	ExpenseAccount   AccountType = "expense"
)

// NormalBalance は勘定科目の通常残高側（借方・貸方）を表す。
type NormalBalance string

const (
	DebitBalance  NormalBalance = "debit"
	CreditBalance NormalBalance = "credit"
)

// ChartOfAccounts: 勘定科目
type ChartOfAccounts struct {
	ID            uint          `gorm:"column:id;primaryKey" json:"id"`
	Code          string        `gorm:"column:code;size:50;uniqueIndex;not null" json:"code"`
	Name          string        `gorm:"column:name;size:255;not null" json:"name"`
	Type          AccountType   `gorm:"column:type;size:50;not null" json:"type"`
	NormalBalance NormalBalance `gorm:"column:normal_balance;size:50;not null" json:"normalBalance"`
	Description   string        `gorm:"column:description" json:"description"`
	IsActive      bool          `gorm:"column:is_active;default:true" json:"isActive"`
	CreatedAt     time.Time     `gorm:"column:created_at" json:"createdAt"`
	UpdatedAt     time.Time     `gorm:"column:updated_at" json:"updatedAt"`
}

// ChartOfAccounts 構造体は simple_ledger_chart_of_accounts テーブルにマッピングされる
func (ChartOfAccounts) TableName() string {
	return "simple_ledger_chart_of_accounts"
}
