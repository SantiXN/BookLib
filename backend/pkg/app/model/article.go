package model

import (
	"booklib/pkg/domain/model"
	"time"
)

type Article struct {
	ID          int
	Title       string
	Content     string
	AuthorID    int
	Status      model.ArticleStatus
	PublishDate *time.Time
}
