package query

import (
	"context"
	"errors"

	"booklib/pkg/app/model"
)

var ErrArticleNotFound = errors.New("article not found")

type ArticleQueryService interface {
	GetArticle(ctx context.Context, id int) (model.Article, error)
	ListPublishedArticles(ctx context.Context, limit, offset *int) ([]model.Article, error)
	ListArticlesByAuthor(ctx context.Context, authorID int) ([]model.Article, error)
	GetTotalCountPublishedArticles(ctx context.Context) (int, error)
}

func NewArticleQueryService(storageQueryService ArticleQueryService) ArticleQueryService {
	return &articleQueryService{
		storageQueryService: storageQueryService,
	}
}

type articleQueryService struct {
	storageQueryService ArticleQueryService
}

func (a *articleQueryService) GetTotalCountPublishedArticles(ctx context.Context) (int, error) {
	return a.storageQueryService.GetTotalCountPublishedArticles(ctx)
}

func (a *articleQueryService) GetArticle(ctx context.Context, id int) (model.Article, error) {
	return a.storageQueryService.GetArticle(ctx, id)
}

func (a *articleQueryService) ListPublishedArticles(ctx context.Context, limit, offset *int) ([]model.Article, error) {
	return a.storageQueryService.ListPublishedArticles(ctx, limit, offset)
}

func (a *articleQueryService) ListArticlesByAuthor(ctx context.Context, authorID int) ([]model.Article, error) {
	return a.storageQueryService.ListArticlesByAuthor(ctx, authorID)
}
