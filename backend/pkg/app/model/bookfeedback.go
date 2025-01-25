package model

import "time"

type BookFeedback struct {
	UserID    int
	BookID    int
	StarCount int
	Comment   *string
}

type BookFeedbackItem struct {
	UserID    int
	BookID    int
	StarCount int
	Comment   *string
	CreatedAt time.Time
}
