package service

import (
	"booklib/pkg/domain/model"
	"context"

	"booklib/pkg/domain/service"
)

type ArticleData struct {
	Title    string
	Content  string
	AuthorID int
}

type ArticleService interface {
	CreateArticle(ctx context.Context, articleData ArticleData) (int, error)
	DeleteArticle(ctx context.Context, id int) error
	EditArticle(ctx context.Context, id int, title, content *string, status *model.ArticleStatus) error
}

type articleService struct {
	domainArticleService service.ArticleService
	permissionChecker    PermissionChecker
}

func NewArticleService(
	domainArticleService service.ArticleService,
	permissionChecker PermissionChecker,
) ArticleService {
	return &articleService{
		domainArticleService: domainArticleService,
		permissionChecker:    permissionChecker,
	}
}

func (a *articleService) CreateArticle(ctx context.Context, articleData ArticleData) (int, error) {
	err := a.permissionChecker.AssertCanCreateArticle(ctx)
	if err != nil {
		return 0, err
	}

	return a.domainArticleService.CreateArticle(articleData.Title, articleData.Content, articleData.AuthorID)
}

func (a *articleService) DeleteArticle(ctx context.Context, id int) error {
	err := a.permissionChecker.AssertCanModifyArticle(ctx, id)
	if err != nil {
		return err
	}

	return a.domainArticleService.DeleteArticle(id)
}

func (a *articleService) EditArticle(ctx context.Context, id int, title, content *string, status *model.ArticleStatus) error {
	err := a.permissionChecker.AssertCanModifyArticle(ctx, id)
	if err != nil {
		return err
	}

	return a.domainArticleService.EditArticle(id, title, content, status)
}
