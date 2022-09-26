package model

type ResetLink struct {
	ID     string `json:"id" gorm:"primaryKey"`
	UserID string `json:"userId"`
	UserEmail string `json:"userEmail"`
	Link   string `json:"link"`
	ValidationCode string `json:"validationCode"`
}