package model

type Experience struct {
	ID          string `json:"ID"`
	UserID      string `json:"UserID"`
	Company     string `json:"Company"`
	Position    string `json:"Position"`
	Description string `json:"Description"`
	Image       string `json:"Image"`
	MonthStart  int    `json:"MonthStart"`
	YearStart   int    `json:"YearStart"`
	MonthEnd    int    `json:"MonthEnd"`
	YearEnd     int    `json:"YearEnd"`
}