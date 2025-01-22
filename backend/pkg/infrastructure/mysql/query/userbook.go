package query

import (
	"context"

	"github.com/jmoiron/sqlx"

	appmodel "booklib/pkg/app/model"
	appquery "booklib/pkg/app/query"
)

func NewUserBookQueryService(client sqlx.DB) appquery.UserBookQueryService {
	return &userBookQueryService{
		client: client,
	}
}

type userBookQueryService struct {
	client sqlx.DB
}

func (u *userBookQueryService) IsInLibrary(ctx context.Context, bookID, userID int) (bool, error) {
	const query = `
		SELECT EXISTS(
			SELECT 1 FROM user_book WHERE book_id = ? AND user_id = ?
		)
	`

	var exists bool
	err := u.client.QueryRowContext(ctx, query, bookID, userID).Scan(&exists)
	if err != nil {
		return false, err
	}

	return exists, nil
}

func (u *userBookQueryService) ListUserBooksByStatus(ctx context.Context, userID int, status appmodel.ReadingStatus, limit, offset *int) ([]appmodel.BookInLibrary, error) {
	const baseQuery = `
		SELECT 
			b.id,
			b.title,
			b.cover_path,
			COALESCE(
				(SELECT AVG(br.star_count) 
				 	FROM book_review br 
				 	WHERE br.book_id = b.id
				 ), 0) AS star_count,
			ub.reading_status
		FROM 
			user_book ub
		JOIN 
			book b ON ub.book_id = b.id
		WHERE 
			ub.user_id = ? AND ub.reading_status = ?
		ORDER BY 
			ub.created_at DESC
	`

	var query string
	var args []interface{}

	args = append(args, userID, status)

	if limit != nil && offset != nil {
		query = baseQuery + " LIMIT ? OFFSET ?"
		args = append(args, *limit, *offset)
	} else {
		query = baseQuery
	}

	var books []sqlxUserBook

	err := u.client.SelectContext(ctx, &books, query, args...)
	if err != nil {
		return nil, err
	}

	result := make([]appmodel.BookInLibrary, 0, len(books))
	for _, book := range books {
		result = append(result, appmodel.BookInLibrary{
			BookID:        book.BookID,
			Title:         book.Title,
			CoverPath:     book.CoverPath,
			Authors:       nil,
			StarCount:     book.StarCount,
			ReadingStatus: appmodel.ReadingStatus(book.ReadingStatus),
		})
	}

	return result, nil
}

func (u *userBookQueryService) GetTotalCount(ctx context.Context, userID int, status appmodel.ReadingStatus) (int, error) {
	const query = `
		SELECT COUNT(*) 
		FROM user_book ub
		JOIN book b ON ub.book_id = b.id
		WHERE ub.user_id = ? AND ub.reading_status = ?
	`

	var count int
	err := u.client.GetContext(ctx, &count, query, userID, status)
	if err != nil {
		return 0, err
	}

	return count, nil
}

type sqlxUserBook struct {
	BookID        int     `db:"id"`
	Title         string  `db:"title"`
	CoverPath     *string `db:"cover_path"`
	StarCount     float32 `db:"star_count"`
	ReadingStatus int     `db:"reading_status"`
}
