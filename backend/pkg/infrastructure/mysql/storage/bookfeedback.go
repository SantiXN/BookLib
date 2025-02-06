package storage

import (
	"booklib/pkg/app/model"
	query2 "booklib/pkg/app/query"
	"booklib/pkg/app/storage"
	"context"
	"github.com/jmoiron/sqlx"
	"strings"
)

func NewBookFeedbackStorage(
	ctx context.Context,
	client sqlx.DB,
) storage.BookFeedbackStorage {
	return &bookFeedbackStorage{
		ctx:    ctx,
		client: client,
	}
}

type bookFeedbackStorage struct {
	ctx    context.Context
	client sqlx.DB
}

func (b *bookFeedbackStorage) Store(bookFeedback model.BookFeedback) error {
	const query = `
        INSERT INTO book_review (user_id, book_id, star_count, comment)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE star_count = VALUES(star_count), comment = VALUES(comment)
    `

	args := []interface{}{
		bookFeedback.UserID,
		bookFeedback.BookID,
		bookFeedback.StarCount,
		bookFeedback.Comment,
	}

	_, err := b.client.ExecContext(b.ctx, query, args...)
	if err != nil {
		if strings.Contains(err.Error(), "foreign key constraint") {
			return query2.ErrBookNotFound
		}
		return err
	}

	return nil
}
