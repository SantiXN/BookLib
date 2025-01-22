package provider

import (
	"context"

	"booklib/pkg/app/model"
)

type CategoryProvider interface {
	GetCategoriesByBook(ctx context.Context, bookID int) ([]model.Category, error)
}
