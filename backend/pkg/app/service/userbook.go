package service

import (
	"booklib/pkg/app/model"
	"booklib/pkg/app/storage"
)

type UserBookService interface {
	AddBookToLibrary(userID, bookID int) error
	RemoveBookFromLibrary(userID, bookID int) error
	ChangeReadingStatus(userBook model.UserBook) error
}

type userBookService struct {
	userBookStorage storage.UserBookStorage
}

func NewUserBookService(userBookStorage storage.UserBookStorage) UserBookService {
	return &userBookService{
		userBookStorage: userBookStorage,
	}
}

func (s *userBookService) AddBookToLibrary(userID, bookID int) error {
	return s.userBookStorage.Store(model.UserBook{BookID: bookID, UserID: userID, Status: model.Planned})
}

func (s *userBookService) RemoveBookFromLibrary(userID, bookID int) error {
	return s.userBookStorage.Delete(userID, bookID)
}

func (s *userBookService) ChangeReadingStatus(userBook model.UserBook) error {
	return s.userBookStorage.Store(userBook)
}
