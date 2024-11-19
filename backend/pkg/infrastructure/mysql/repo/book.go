package repo

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"strings"

	"booklib/pkg/domain/model"
)

func NewBookRepository(
	ctx context.Context,
	userID int,
) model.BookRepository {
	return &bookRepository{
		ctx:    ctx,
		userID: userID,
	}
}

//TODO добавить клиент

type bookRepository struct {
	ctx    context.Context
	userID int
}

func (repo *bookRepository) NextID() (int, error) {
	//TODO implement me
	panic("implement me")
}

func (repo *bookRepository) Store(book model.Book) error {
	const query = `
	    INSERT INTO 
	        book (
	            title,
	            description,
				cover_path,
	            created_by
	        )
		VALUES (?, ?, ?, ?)
		ON DUPLICATE KEY UPDATE
			title = VALUES(title),
			description = VALUES(description),
			cover_path = VALUES(cover_path)                    
	`

	_, err := repo.client.ExecContext()

	return err
}

func (repo *bookRepository) StoreAll(books []model.Book) error {
	const query = `
	    INSERT INTO 
	        book (
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
		queryPlaceholders = append(queryPlaceholders, "(?, ?, ?, ?)")
		args = append(args,
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
	err := repo.client.GetContext(repo.ctx, &w, query, uuid.UUID(id))
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

	var params []interface{}
	if len(ids) != 0 {

	}

	var sqlxBooks []sqlxBook
	err := repo.client.SelectContext(repo.ctx, &sqlxBooks, query, params...)
	if err != nil {
		return nil, err
	}

	var books []model.Book
	for _, book := range sqlxBooks {
		books = append(books, model.NewBook(book.ID, book.Title, book.Description, book.CoverPath))
	}
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
