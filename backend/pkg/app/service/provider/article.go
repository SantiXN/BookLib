package provider

import (
	"context"
)

type ArticleProvider interface {
	IsAuthor(ctx context.Context, userID, articleID int) (bool, error)
}
