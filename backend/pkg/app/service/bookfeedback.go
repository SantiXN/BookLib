package service

import (
	"booklib/pkg/app/model"
	"booklib/pkg/app/storage"
)

type BookFeedbackService interface {
	SaveFeedback(feedback model.BookFeedback) error
}

type bookFeedbackService struct {
	bookFeedbackStorage storage.BookFeedbackStorage
}

func NewBookFeedbackService(bookFeedbackStorage storage.BookFeedbackStorage) BookFeedbackService {
	return &bookFeedbackService{
		bookFeedbackStorage: bookFeedbackStorage,
	}
}

func (b *bookFeedbackService) SaveFeedback(feedback model.BookFeedback) error {
	return b.bookFeedbackStorage.Store(feedback)
}
