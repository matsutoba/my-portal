package models

import "time"

// Transaction: 取引記録（複式簿記における1つの仕訳伝票）
type Transaction struct {
	ID          uint      `gorm:"column:id;primaryKey" json:"id"`
	Date        time.Time `gorm:"column:date;type:date;not null;index:simple_ledger_transactions_date_created_idx,sort:desc" json:"date"`
	Description string    `gorm:"column:description" json:"description"`

	JournalEntries []JournalEntry `gorm:"foreignKey:TransactionID" json:"journalEntries,omitempty"`

	// IsCorrection: この取引が別の取引の訂正として記録されたものかどうか
	IsCorrection bool `gorm:"column:is_correction;default:false" json:"isCorrection"`

	// CorrectedFromID: 訂正元の取引ID（訂正取引の場合のみ）
	CorrectedFromID *uint  `gorm:"column:corrected_from_id;index" json:"correctedFromId,omitempty"`
	CorrectionNote  string `gorm:"column:correction_note" json:"correctionNote"`

	CreatedAt time.Time `gorm:"column:created_at;index:simple_ledger_transactions_date_created_idx,sort:desc" json:"createdAt"`
	UpdatedAt time.Time `gorm:"column:updated_at" json:"updatedAt"`
}

// Transaction 構造体は simple_ledger_transactions テーブルにマッピングされる
func (Transaction) TableName() string {
	return "simple_ledger_transactions"
}
