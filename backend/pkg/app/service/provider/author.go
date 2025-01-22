package provider

import (
	"context"

	"booklib/pkg/app/model"
)

type AuthorProvider interface {
	GetAuthorsByBookID(ctx context.Context, bookID int) ([]model.Author, error)
}
