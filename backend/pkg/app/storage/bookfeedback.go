package storage

import "booklib/pkg/app/model"

type BookFeedbackStorage interface {
	Store(bookFeedback model.BookFeedback) error
}
