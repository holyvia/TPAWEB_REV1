package model

import (
	"time"

	"github.com/lib/pq"
)

type Post struct {
	ID        string         `json:"id" gorm:"primaryKey"`
	UserID    string         `json:"userId"`
	Caption   string         `json:"caption"`
	PhotoURL  string         `json:"photo_url"`
	VideoURL  string         `json:"video_url"`
	Likes     pq.StringArray `json:"likes" gorm:"type:text[]"`
	Comments  pq.StringArray `json:"comments" gorm:"type:text[]"`
	Sends     pq.StringArray `json:"sends" gorm:"type:text[]"`
	CreatedAt time.Time      `json:"created_at" gorm:"type:timestamp"`
}

type Comment struct {
	ID               string         `json:"id" gorm:"primaryKey"`
	UserID           string         `json:"userId"`
	Comment          string         `json:"comment"`
	Likes            pq.StringArray `json:"likes" gorm:"type:text[]"`
	Reply            pq.StringArray `json:"reply" gorm:"type:text[]"`
	CreatedAt        time.Time      `json:"created_at" gorm:"type:timestamp"`
	ReplyToCommentID string         `json:"replyToCommentId"`
}
