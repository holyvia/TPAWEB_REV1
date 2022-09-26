package model

import "time"

type Job struct {
	ID          string    `json:"ID"`
	UserID      string    `json:"UserID"`
	Title       string    `json:"Title"`
	Company     string    `json:"Company"`
	Position    string    `json:"Position"`
	Description string    `json:"Description"`
	CreatedAt   time.Time `json:"created_at" gorm:"type:timestamp"`
}