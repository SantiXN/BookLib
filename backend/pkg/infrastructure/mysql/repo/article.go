package repo

import (
	"context"
	"database/sql"
	"errors"

	"github.com/jmoiron/sqlx"

	"booklib/pkg/domain/model"
)

func NewArticleRepository(
	ctx context.Context,
	client sqlx.DB,
) model.ArticleRepository {
	return &articleRepository{
		ctx:    ctx,
		client: client,
	}
}

type articleRepository struct {
	ctx    context.Context
	client sqlx.DB
}

func (a *articleRepository) NextID() (int, error) {
	const query = `
		SELECT COALESCE(MAX(id), 0) + 1 FROM article
	`

	var nextID int
	err := a.client.QueryRowContext(a.ctx, query).Scan(&nextID)
	if err != nil {
		return 0, err
	}

	return nextID, nil
}

func (a *articleRepository) Store(article model.Article) error {
	const query = `
	    INSERT INTO 
	        article (
	            id,
	            name,
	            content,
	            created_by,
	        	status
	        )
		VALUES (?, ?, ?, ?, ?)
		ON DUPLICATE KEY UPDATE
			name = VALUES(name),
			content = VALUES(content)
		    status = VALUES(status)
	`

	_, err := a.client.ExecContext(
		a.ctx,
		query,
		article.ID(),
		article.Title(),
		article.Content(),
		article.AuthorID(),
		article.Status(),
	)
	return err
}

func (a *articleRepository) FindOne(id int) (model.Article, error) {
	const query = `
		SELECT
			id,
			name,
			content,
			created_by,
			status
		FROM
			article
		WHERE id = ?
	`
	var article sqlxArticle
	err := a.client.GetContext(a.ctx, &article, query, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, model.ErrArticleNotFound
		}
		return nil, err
	}

	return model.NewArticle(
		article.ID,
		article.Title,
		article.Content,
		article.AuthorID,
		model.ArticleStatus(article.Status),
	), nil
}

func (a *articleRepository) Remove(id int) error {
	const query = `
	    DELETE FROM article WHERE id = ?
    `

	result, err := a.client.ExecContext(a.ctx, query, id)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return errors.New(model.ErrArticleNotFound.Error())
	}

	return nil
}

type sqlxArticle struct {
	ID       int    `db:"id"`
	Title    string `db:"name"`
	Content  string `db:"content"`
	AuthorID int    `db:"created_by"`
	Status   int    `db:"status"`
}
