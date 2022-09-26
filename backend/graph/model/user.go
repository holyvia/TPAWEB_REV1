package model

import "github.com/lib/pq"

type User struct {
	ID             string         `json:"id" gorm:"primaryKey"`
	Name           string         `json:"name"`
	Email          string         `json:"email"`
	Password       string         `json:"password"`
	Validate       bool           `json:"validate"`
	Work           string         `json:"work"`
	Region         string         `json:"region"`
	FollowedUser   pq.StringArray `json:"followed_user" gorm:"type:text[]"`
	RequestConnect pq.StringArray `json:"request_connect" gorm:"type:text[]"`
	ConnectedUser  pq.StringArray `json:"connected_user" gorm:"type:text[]"`
	PendingRequest  pq.StringArray `json:"pending_request" gorm:"type:text[]"`
	ViewProfile  pq.StringArray `json:"view_profile" gorm:"type:text[]"`
	BlockedUser pq.StringArray `json:"blocked_user" gorm:"type:text[]"`
	BackgroundPhoto string         `json:"background_photo"`
	PhotoProfile   string         `json:"photo_profile"`
	Education      string         `json:"education"`
}