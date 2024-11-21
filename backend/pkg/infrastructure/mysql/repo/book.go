package repo

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"github.com/jmoiron/sqlx"
	"strings"

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

//TODO добавить клиент

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

	return err
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
	return err
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

	return model.NewBook(
		b.ID,
		b.Title,
		b.Description,
		b.CoverPath,
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
		books = append(books, model.NewBook(book.ID, book.Title, book.Description, book.CoverPath))
	}

	return books, nil
}

func (repo *bookRepository) Remove(id int) error {
	const sqlQuery = `DELETE FROM book WHERE id = ?`
	_, err := repo.client.ExecContext(repo.ctx, sqlQuery, id)

	return err
}

type sqlxBook struct {
	ID          int     `db:"id"`
	Title       string  `db:"title"`
	Description *string `db:"description"`
	CoverPath   *string `db:"cover_path"`
}
