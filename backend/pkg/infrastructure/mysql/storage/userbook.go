package storage

import (
	"context"

	"github.com/jmoiron/sqlx"

	"booklib/pkg/app/model"
	"booklib/pkg/app/storage"
	domainmodel "booklib/pkg/domain/model"
)

func NewUserBookStorage(
	ctx context.Context,
	client sqlx.DB,
) storage.UserBookStorage {
	return &userBookStorage{
		ctx:    ctx,
		client: client,
	}
}

func (u *userBookStorage) Store(userBook model.UserBook) error {
	bookExists, err := u.checkIfBookExists(userBook.BookID)
	if err != nil {
		return err
	}
	if !bookExists {
		return domainmodel.ErrBookNotFound
	}

	userExists, err := u.checkIfUserExists(userBook.UserID)
	if err != nil {
		return err
	}
	if !userExists {
		return domainmodel.ErrUserNotFound
	}

	const query = `
		INSERT INTO user_book (user_id, book_id, reading_status)
		VALUES (?, ?, ?)
		ON DUPLICATE KEY UPDATE reading_status = VALUES(reading_status)
	`

	_, err = u.client.ExecContext(u.ctx, query, userBook.UserID, userBook.BookID, userBook.Status)
	return err
}

func (u *userBookStorage) Delete(userID, bookID int) error {
	const query = `
		DELETE FROM user_book 
		WHERE user_id = ? AND book_id = ?
	`
	result, err := u.client.ExecContext(u.ctx, query, userID, bookID)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return domainmodel.ErrBookNotFound
	}

	return nil
}

func (u *userBookStorage) checkIfBookExists(bookID int) (bool, error) {
	const query = `SELECT COUNT(*) FROM book WHERE id = ?`
	var count int
	err := u.client.GetContext(u.ctx, &count, query, bookID)
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func (u *userBookStorage) checkIfUserExists(userID int) (bool, error) {
	const query = `SELECT COUNT(*) FROM user WHERE id = ?`
	var count int
	err := u.client.GetContext(u.ctx, &count, query, userID)
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

type userBookStorage struct {
	ctx    context.Context
	client sqlx.DB
}
