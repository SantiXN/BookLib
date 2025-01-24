package service

import (
	"booklib/pkg/domain/model"
)

type ArticleData struct {
	Title    string
	Content  string
	AuthorID int
	Status   model.ArticleStatus
}

type ArticleService interface {
	CreateArticle(title, content string, authorID int) (int, error)
	DeleteArticle(id int) error
	EditArticle(id int, title *string, content *string, status *model.ArticleStatus) error
}

func NewArticleService(
	authorRepository model.ArticleRepository,
) ArticleService {
	return &articleService{
		repo: authorRepository,
	}
}

type articleService struct {
	repo model.ArticleRepository
}

func (a *articleService) CreateArticle(title, content string, authorID int) (int, error) {
	id, err := a.repo.NextID()
	if err != nil {
		return 0, err
	}
	author := model.NewArticle(
		id,
		title,
		content,
		authorID,
		model.Unpublished,
	)

	err = a.repo.Store(author)
	if err != nil {
		return 0, err
	}
	return id, nil
}

func (a *articleService) DeleteArticle(id int) error {
	_, err := a.repo.FindOne(id)
	if err != nil {
		return err
	}

	return a.repo.Remove(id)
}

func (a *articleService) EditArticle(id int, title *string, content *string, status *model.ArticleStatus) error {
	article, err := a.repo.FindOne(id)
	if err != nil {
		return err
	}

	if title != nil {
		article.SetTitle(*title)
	}
	if content != nil {
		article.SetContent(*content)
	}
	if status != nil {
		article.SetStatus(*status)
	}
	return a.repo.Store(article)
}
