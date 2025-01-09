package repo

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"

	"github.com/jmoiron/sqlx"

	"booklib/pkg/domain/model"
	inframysql "booklib/pkg/infrastructure/mysql"
)

func NewBookRepository(
	ctx context.Context,
	client inframysql.ClientContext,
	userID int,
) model.BookRepository {
	return &bookRepository{
		ctx:    ctx,
		client: client,
		userID: userID,
	}
}

type bookRepository struct {
	ctx    context.Context
	client inframysql.ClientContext
	userID int
}

func (repo *bookRepository) NextID() (int, error) {
	const query = `
		SELECT COALESCE(MAX(id), 0) + 1 FROM book
	`

	var nextID int
	err := repo.client.QueryRowContext(repo.ctx, query).Scan(&nextID)
	if err != nil {
		return 0, err
	}

	return nextID, nil
}

func (repo *bookRepository) Store(book model.Book) error {
	const query = `
	    INSERT INTO 
	        book (
	            id,
	            title,
	            description,
				cover_path,
	            created_by
	        )
		VALUES (?, ?, ?, ?, ?)
		ON DUPLICATE KEY UPDATE
			title = VALUES(title),
			description = VALUES(description),
			cover_path = VALUES(cover_path)                    
	`

	_, err := repo.client.ExecContext(
		repo.ctx,
		query,
		book.ID(),
		book.Title(),
		book.Description(),
		book.CoverPath(),
		repo.userID,
	)
	if err != nil {
		return err
	}

	err = repo.updateAuthorBook(book)
	if err != nil {
		return err
	}
	return repo.updateCategoryBook(book)
}

func (repo *bookRepository) StoreAll(books []model.Book) error {
	const query = `
	    INSERT INTO 
	        book (
	            id,
	            title,
	            description,
				cover_path,
	            created_by
	        )
		VALUES %s
		ON DUPLICATE KEY UPDATE
			title = VALUES(title),
			description = VALUES(description),
			cover_path = VALUES(cover_path)                    
	`

	args := make([]interface{}, 0, len(books))
	queryPlaceholders := make([]string, 0, len(books))
	for _, b := range books {
		queryPlaceholders = append(queryPlaceholders, "(?, ?, ?, ?, ?)")
		args = append(args,
			b.ID(),
			b.Title(),
			b.Description(),
			b.CoverPath(),
			repo.userID,
		)
	}

	_, err := repo.client.ExecContext(repo.ctx, fmt.Sprintf(query, strings.Join(queryPlaceholders, ", ")), args...)
	if err != nil {
		return err
	}

	for _, b := range books {
		err = repo.updateAuthorBook(b)
		if err != nil {
			return err
		}
		err = repo.updateCategoryBook(b)
		if err != nil {
			return err
		}
	}
	return nil
}

func (repo *bookRepository) FindOne(id int) (model.Book, error) {
	const query = `
		SELECT
			id,
			title,
			description,
			cover_path
		FROM
			book
		WHERE id = ?
	`
	var b sqlxBook
	err := repo.client.GetContext(repo.ctx, &b, query, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, errors.New(model.ErrBookNotFound.Error())
		}
		return nil, err
	}

	authorIDs, err := repo.findAuthorIDs(b.ID)
	if err != nil {
		return nil, err
	}
	categoryIDs, err := repo.findCategoryIDs(b.ID)
	if err != nil {
		return nil, err
	}
	return model.NewBook(
		b.ID,
		b.Title,
		b.Description,
		b.CoverPath,
		authorIDs,
		categoryIDs,
	), nil
}

func (repo *bookRepository) FindAll(ids []int) ([]model.Book, error) {
	if len(ids) == 0 {
		return nil, nil
	}
	const query = `
		SELECT
			id,
			title,
			description,
			cover_path
		FROM
			book
		WHERE id IN (?)
	`
	inQuery, args, err := sqlx.In(query, ids)
	if err != nil {
		return nil, err
	}

	var sqlxBooks []sqlxBook
	err = repo.client.SelectContext(repo.ctx, &sqlxBooks, inQuery, args...)
	if err != nil {
		return nil, err
	}

	var books []model.Book
	for _, book := range sqlxBooks {
		authorIDs, err := repo.findAuthorIDs(book.ID)
		if err != nil {
			return nil, err
		}
		categoryIDs, err := repo.findCategoryIDs(book.ID)
		if err != nil {
			return nil, err
		}
		books = append(
			books,
			model.NewBook(
				book.ID,
				book.Title,
				book.Description,
				book.CoverPath,
				authorIDs,
				categoryIDs,
			),
		)
	}

	return books, nil
}

func (repo *bookRepository) Remove(id int) error {
	const sqlQuery = `DELETE FROM book WHERE id = ?`
	_, err := repo.client.ExecContext(repo.ctx, sqlQuery, id)

	return err
}

func (repo *bookRepository) findAuthorIDs(bookID int) ([]int, error) {
	const query = `
		SELECT DISTINCT author_id
		FROM author_book
		WHERE book_id = ?
	`

	var authorIDs []int
	err := repo.client.SelectContext(repo.ctx, &authorIDs, query, bookID)
	if err != nil {
		return nil, err
	}

	return authorIDs, nil
}

func (repo *bookRepository) findCategoryIDs(bookID int) ([]int, error) {
	const query = `
		SELECT DISTINCT category_id
		FROM category_book
		WHERE book_id = ?
	`

	var categoryIDs []int
	err := repo.client.SelectContext(repo.ctx, &categoryIDs, query, bookID)
	if err != nil {
		return nil, err
	}

	return categoryIDs, nil
}

func (repo *bookRepository) updateAuthorBook(book model.Book) error {
	const authorBookQuery = `
		INSERT INTO author_book (author_id, book_id)
		VALUES %s
		ON DUPLICATE KEY UPDATE author_id = VALUES(author_id), book_id = VALUES(book_id)
	`

	args := make([]interface{}, 0, len(book.AuthorIDs()))
	queryPlaceholders := make([]string, 0, len(book.AuthorIDs()))

	for _, authorID := range book.AuthorIDs() {
		queryPlaceholders = append(queryPlaceholders, "(?, ?)")
		args = append(args, authorID, book.ID())
	}

	_, err := repo.client.ExecContext(repo.ctx, fmt.Sprintf(authorBookQuery, strings.Join(queryPlaceholders, ", ")), args...)
	return err
}

func (repo *bookRepository) updateCategoryBook(book model.Book) error {
	const categoryBookQuery = `
		INSERT INTO category_book (category_id, book_id)
		VALUES %s
		ON DUPLICATE KEY UPDATE category_id = VALUES(category_id), book_id = VALUES(book_id)
	`

	args := make([]interface{}, 0, len(book.CategoryIDs()))
	queryPlaceholders := make([]string, 0, len(book.CategoryIDs()))

	for _, categoryID := range book.CategoryIDs() {
		queryPlaceholders = append(queryPlaceholders, "(?, ?)")
		args = append(args, categoryID, book.ID())
	}

	_, err := repo.client.ExecContext(repo.ctx, fmt.Sprintf(categoryBookQuery, strings.Join(queryPlaceholders, ", ")), args...)
	return err
}

type sqlxBook struct {
	ID          int     `db:"id"`
	Title       string  `db:"title"`
	Description *string `db:"description"`
	CoverPath   *string `db:"cover_path"`
}
