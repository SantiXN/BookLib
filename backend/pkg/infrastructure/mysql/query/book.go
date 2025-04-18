package query

import (
	"context"
	"database/sql"
	"errors"
	"github.com/jmoiron/sqlx"

	"booklib/pkg/app/model"
	appquery "booklib/pkg/app/query"
)

func NewBookQueryService(client sqlx.DB) appquery.BookQueryService {
	return &bookQueryService{
		client: client,
	}
}

type bookQueryService struct {
	client sqlx.DB
}

func (b *bookQueryService) GetTotalCountByCategory(ctx context.Context, categoryID int) (int, error) {
	const query = `
        SELECT 
            COUNT(b.id) 
        FROM 
            book b
        JOIN 
            category_book cb ON b.id = cb.book_id
        WHERE 
            cb.category_id = ?
    `

	var count int
	err := b.client.GetContext(ctx, &count, query, categoryID)
	if err != nil {
		return 0, err
	}

	return count, nil
}

func (b *bookQueryService) IsBookExist(ctx context.Context, bookID int) (bool, error) {
	const query = `
		SELECT EXISTS(
			SELECT 1 FROM book WHERE id = ?
		)
	`

	var exists bool
	err := b.client.QueryRowContext(ctx, query, bookID).Scan(&exists)
	if err != nil {
		return false, err
	}

	return exists, nil
}

func (b *bookQueryService) ListBooksByCategory(ctx context.Context, categoryID int, limit, offset *int) ([]model.Book, error) {
	const baseQuery = `
        SELECT 
            b.id,
            b.title,
            b.file_path,
            b.cover_path,
            COALESCE(
                (SELECT AVG(br.star_count) 
                  FROM book_review br 
                  WHERE br.book_id = b.id
                 ), 0) AS star_count
        FROM 
            book b
        JOIN 
            category_book cb ON b.id = cb.book_id
        WHERE 
            cb.category_id = ?
        ORDER BY 
            b.created_at DESC
    `

	var query string
	var args []interface{}

	args = append(args, categoryID)

	if limit != nil && offset != nil {
		query = baseQuery + " LIMIT ? OFFSET ?"
		args = append(args, *limit, *offset)
	} else {
		query = baseQuery
	}

	var sqlxBooks []sqlxBook
	err := b.client.SelectContext(ctx, &sqlxBooks, query, args...)
	if err != nil {
		return nil, err
	}

	var books []model.Book
	for _, sqlBook := range sqlxBooks {
		book := model.Book{
			ID:         sqlBook.ID,
			Title:      sqlBook.Title,
			FilePath:   sqlBook.FilePath,
			CoverPath:  sqlBook.CoverPath,
			Authors:    nil,
			Categories: nil,
			StarCount:  sqlBook.StarCount,
		}

		books = append(books, book)
	}

	return books, nil
}

func (b *bookQueryService) ListBooksByAuthor(ctx context.Context, authorID int) ([]model.Book, error) {
	const query = `
        SELECT 
            b.id,
            b.title,
            b.file_path,
            b.cover_path,
            COALESCE(
                (SELECT AVG(br.star_count) 
                  FROM book_review br 
                  WHERE br.book_id = b.id
                 ), 0) AS star_count
        FROM 
            book b
        JOIN 
            author_book ab ON b.id = ab.book_id
        WHERE 
            ab.author_id = ?
        ORDER BY 
            b.created_at DESC
    `

	var sqlxBooks []sqlxBook
	err := b.client.SelectContext(ctx, &sqlxBooks, query, authorID)
	if err != nil {
		return nil, err
	}
	var books []model.Book
	for _, sqlBook := range sqlxBooks {
		book := model.Book{
			ID:         sqlBook.ID,
			Title:      sqlBook.Title,
			FilePath:   sqlBook.FilePath,
			CoverPath:  sqlBook.CoverPath,
			Authors:    nil,
			Categories: nil,
			StarCount:  sqlBook.StarCount,
		}

		books = append(books, book)
	}

	return books, nil
}

func (b *bookQueryService) GetBook(ctx context.Context, id int) (model.Book, error) {
	const query = `
        SELECT 
            b.id,
            b.title,
            b.description,
            b.file_path,
            b.cover_path,
            COALESCE(
                (SELECT AVG(br.star_count) 
                  FROM book_review br 
                  WHERE br.book_id = b.id
                 ), 0) AS star_count
        FROM 
            book b
        WHERE 
            b.id = ?
    `

	var book sqlxBook
	err := b.client.GetContext(ctx, &book, query, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return model.Book{}, appquery.ErrBookNotFound
		}
		return model.Book{}, err
	}

	return model.Book{
		ID:          book.ID,
		Title:       book.Title,
		Description: book.Description,
		FilePath:    book.FilePath,
		CoverPath:   book.CoverPath,
		StarCount:   book.StarCount,
	}, nil
}

func (b *bookQueryService) SearchBooks(ctx context.Context, searchString string, limit, offset *int) ([]model.Book, error) {
	const baseQuery = `
        SELECT 
            b.id,
            b.title,
            b.description,
            b.file_path,
            b.cover_path,
            COALESCE(
                (SELECT AVG(br.star_count) 
                  FROM book_review br 
                  WHERE br.book_id = b.id
                 ), 0) AS star_count
        FROM 
            book b
        WHERE 
            b.title LIKE ?
        ORDER BY 
            b.created_at DESC
    `

	var query string
	var args []interface{}

	searchPattern := "%" + searchString + "%"
	args = append(args, searchPattern)

	if limit != nil && offset != nil {
		query = baseQuery + " LIMIT ? OFFSET ?"
		args = append(args, *limit, *offset)
	} else {
		query = baseQuery
	}

	var sqlxBooks []sqlxBook
	err := b.client.SelectContext(ctx, &sqlxBooks, query, args...)
	if err != nil {
		return nil, err
	}

	var books []model.Book
	for _, sqlBook := range sqlxBooks {
		book := model.Book{
			ID:          sqlBook.ID,
			Title:       sqlBook.Title,
			Description: sqlBook.Description,
			FilePath:    sqlBook.FilePath,
			CoverPath:   sqlBook.CoverPath,
			StarCount:   sqlBook.StarCount,
			Authors:     nil,
			Categories:  nil,
		}

		books = append(books, book)
	}

	return books, nil
}

func (b *bookQueryService) GetTotalCountBySearchString(ctx context.Context, searchString string) (int, error) {
	const query = `
        SELECT 
            COUNT(*)
        FROM 
            book b
        WHERE 
            b.title LIKE ?
    `

	searchPattern := "%" + searchString + "%"
	args := []interface{}{searchPattern}

	var count int
	err := b.client.GetContext(ctx, &count, query, args...)
	if err != nil {
		return 0, err
	}

	return count, nil
}

type sqlxBook struct {
	ID          int     `db:"id"`
	Title       string  `db:"title"`
	Description *string `db:"description"`
	FilePath    string  `db:"file_path"`
	CoverPath   string  `db:"cover_path"`
	StarCount   float32 `db:"star_count"`
}
