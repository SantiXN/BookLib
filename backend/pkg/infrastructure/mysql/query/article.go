package query

import (
	"booklib/pkg/app/model"
	appquery "booklib/pkg/app/query"
	domainmodel "booklib/pkg/domain/model"
	"context"
	"database/sql"
	"errors"
	"github.com/jmoiron/sqlx"
	"time"
)

func NewArticleQueryService(client sqlx.DB) appquery.ArticleQueryService {
	return &articleQueryService{
		client: client,
	}
}

type articleQueryService struct {
	client sqlx.DB
}

func (a *articleQueryService) GetTotalCountPublishedArticles(ctx context.Context) (int, error) {
	const query = `
        SELECT 
            COUNT(*) 
        FROM 
            article a
        WHERE 
            a.status = 1
    `

	var count int
	err := a.client.GetContext(ctx, &count, query)
	if err != nil {
		return 0, err
	}

	return count, nil
}

func (a *articleQueryService) GetArticle(ctx context.Context, id int) (model.Article, error) {
	const query = `
        SELECT 
            a.id,
            a.name,
            a.content,
            a.created_by,
            a.status,
            a.updated_at
        FROM 
            article a
        WHERE 
            a.id = ?
    `

	var article sqlxArticle
	err := a.client.GetContext(ctx, &article, query, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return model.Article{}, appquery.ErrArticleNotFound
		}
		return model.Article{}, err
	}

	return model.Article{
		ID:          article.ID,
		Title:       article.Name,
		Content:     article.Content,
		AuthorID:    article.AuthorID,
		Status:      domainmodel.ArticleStatus(article.Status),
		PublishDate: article.PublishedAt,
	}, nil
}

func (a *articleQueryService) ListPublishedArticles(ctx context.Context, limit, offset *int) ([]model.Article, error) {
	const baseQuery = `
        SELECT 
            a.id,
            a.name,
            a.content,
            a.created_by,
            a.status,
            a.updated_at
        FROM 
            article a
        WHERE 
            a.status = 1 
        ORDER BY 
            a.updated_at DESC
    `

	var query string
	var args []interface{}

	if limit != nil && offset != nil {
		query = baseQuery + " LIMIT ? OFFSET ?"
		args = append(args, *limit, *offset)
	} else {
		query = baseQuery
	}

	var articles []sqlxArticle
	err := a.client.SelectContext(ctx, &articles, query, args...)
	if err != nil {
		return nil, err
	}

	var result []model.Article
	for _, article := range articles {
		result = append(result, model.Article{
			ID:          article.ID,
			Title:       article.Name,
			Content:     article.Content,
			AuthorID:    article.AuthorID,
			Status:      domainmodel.ArticleStatus(article.Status),
			PublishDate: article.PublishedAt,
		})
	}

	return result, nil
}

func (a *articleQueryService) ListArticlesByAuthor(ctx context.Context, authorID int) ([]model.Article, error) {
	const query = `
        SELECT 
            a.id,
            a.name,
            a.content,
            a.created_by,
            a.status,
            a.updated_at
        FROM 
            article a
        WHERE 
            a.created_by = ?
        ORDER BY 
            a.updated_at DESC
    `

	var articles []sqlxArticle
	err := a.client.SelectContext(ctx, &articles, query, authorID)
	if err != nil {
		return nil, err
	}

	var result []model.Article
	for _, article := range articles {
		result = append(result, model.Article{
			ID:          article.ID,
			Title:       article.Name,
			Content:     article.Content,
			AuthorID:    article.AuthorID,
			Status:      domainmodel.ArticleStatus(article.Status),
			PublishDate: article.PublishedAt,
		})
	}

	return result, nil
}

type sqlxArticle struct {
	ID          int        `db:"id"`
	Name        string     `db:"name"`
	Content     string     `db:"content"`
	AuthorID    int        `db:"created_by"`
	Status      int        `db:"status"`
	PublishedAt *time.Time `db:"updated_at"`
}
