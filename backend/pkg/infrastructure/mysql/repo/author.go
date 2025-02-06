package repo

import (
	"context"
	"database/sql"
	"errors"

	"github.com/jmoiron/sqlx"

	"booklib/pkg/domain/model"
)

func NewAuthorRepository(
	ctx context.Context,
	client sqlx.DB,
) model.AuthorRepository {
	return &authorRepository{
		ctx:    ctx,
		client: client,
	}
}

type authorRepository struct {
	ctx    context.Context
	client sqlx.DB
}

func (repo *authorRepository) NextID() (int, error) {
	const query = `
		SELECT COALESCE(MAX(id), 0) + 1 FROM author
	`

	var nextID int
	err := repo.client.QueryRowContext(repo.ctx, query).Scan(&nextID)
	if err != nil {
		return 0, err
	}

	return nextID, nil
}

func (repo *authorRepository) Store(author model.Author) error {
	const query = `
	    INSERT INTO 
	        author (
	            id,
	            first_name,
	            last_name,
	            avatar_path,
				description
	        )
		VALUES (?, ?, ?, ?, ?)
		ON DUPLICATE KEY UPDATE
			first_name = VALUES(first_name),
			last_name = VALUES(last_name),
			avatar_path = VALUES(avatar_path),
			description = VALUES(description)                 
	`

	_, err := repo.client.ExecContext(
		repo.ctx,
		query,
		author.ID(),
		author.FirstName(),
		author.LastName(),
		author.AvatarPath(),
		author.Description(),
	)
	return err
}

func (repo *authorRepository) FindOne(id int) (model.Author, error) {
	const query = `
		SELECT
			id,
			first_name,
			last_name,
			avatar_path,
			description
		FROM
			author
		WHERE id = ?
	`
	var a sqlxAuthor
	err := repo.client.GetContext(repo.ctx, &a, query, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, errors.New(model.ErrAuthorNotFound.Error())
		}
		return nil, err
	}

	return model.NewAuthor(
		a.ID,
		a.FirstName,
		a.LastName,
		a.AvatarPath,
		a.Description,
	), nil
}

func (repo *authorRepository) FindAll(ids []int) ([]model.Author, error) {
	if len(ids) == 0 {
		return nil, nil
	}
	const query = `
		SELECT
			id,
			first_name,
			last_name,
			avatar_path,
			description
		FROM
			author
		WHERE id IN (?)
	`
	inQuery, args, err := sqlx.In(query, ids)
	if err != nil {
		return nil, err
	}

	var sqlxAuthors []sqlxAuthor
	err = repo.client.SelectContext(repo.ctx, &sqlxAuthors, inQuery, args...)
	if err != nil {
		return nil, err
	}

	var authors []model.Author
	for _, author := range sqlxAuthors {
		authors = append(authors, model.NewAuthor(author.ID, author.FirstName, author.LastName, author.AvatarPath, author.Description))
	}

	return authors, nil
}

func (repo *authorRepository) Remove(id int) error {
	const sqlQuery = `DELETE FROM author WHERE id = ?`
	_, err := repo.client.ExecContext(repo.ctx, sqlQuery, id)

	return err
}

type sqlxAuthor struct {
	ID          int     `db:"id"`
	FirstName   string  `db:"first_name"`
	LastName    *string `db:"last_name"`
	AvatarPath  *string `db:"avatar_path"`
	Description *string `db:"description"`
}
