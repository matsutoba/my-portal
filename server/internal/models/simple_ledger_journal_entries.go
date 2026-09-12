package models

import "time"

// EntryType は仕訳の借方・貸方を表す。
type EntryType string

const (
	DebitEntry  EntryType = "debit"
	CreditEntry EntryType = "credit"
)

// JournalEntry: 仕訳エントリー（取引を構成する借方または貸方の1行）
type JournalEntry struct {
	ID                uint             `gorm:"column:id;primaryKey" json:"id"`
	TransactionID     uint             `gorm:"column:transaction_id;not null;index" json:"transactionId"`
	ChartOfAccountsID uint             `gorm:"column:chart_of_accounts_id;not null;index" json:"chartOfAccountsId"`
	ChartOfAccounts   *ChartOfAccounts `gorm:"foreignKey:ChartOfAccountsID" json:"chartOfAccounts,omitempty"`
	Type              EntryType        `gorm:"column:type;size:50;not null" json:"type"`
	Amount            int              `gorm:"column:amount;not null" json:"amount"`
	Description       string           `gorm:"column:description" json:"description"`
	CreatedAt         time.Time        `gorm:"column:created_at" json:"createdAt"`
	UpdatedAt         time.Time        `gorm:"column:updated_at" json:"updatedAt"`
}

// JournalEntry 構造体は simple_ledger_journal_entries テーブルにマッピングされる
func (JournalEntry) TableName() string {
	return "simple_ledger_journal_entries"
}
