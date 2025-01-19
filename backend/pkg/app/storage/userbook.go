package storage

import "booklib/pkg/app/model"

type UserBookStorage interface {
	Store(userBook model.UserBook) error
	Delete(userID, bookID int) error
}
