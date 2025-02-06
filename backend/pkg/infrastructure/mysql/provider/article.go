package provider

import (
	"booklib/pkg/app/service/provider"
	"context"
	"github.com/jmoiron/sqlx"
)

func NewArticleProvider(client sqlx.DB) provider.ArticleProvider {
	return &articleProvider{client: client}
}

type articleProvider struct {
	client sqlx.DB
}

func (a *articleProvider) IsAuthor(ctx context.Context, userID, articleID int) (bool, error) {
	const query = `
		SELECT COUNT(*) 
		FROM article 
		WHERE id = ? AND created_by = ?
	`

	var count int
	err := a.client.QueryRowContext(ctx, query, articleID, userID).Scan(&count)
	if err != nil {
		return false, err
	}

	return count > 0, nil
}
