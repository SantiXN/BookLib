package query

import (
	appquery "booklib/pkg/app/query"
	"context"
	"github.com/jmoiron/sqlx"
)

func NewCategoryQueryService(client sqlx.DB) appquery.CategoryQueryService {
	return &categoryQueryService{
		client: client,
	}
}

type categoryQueryService struct {
	client sqlx.DB
}

func (c *categoryQueryService) ListCategories(ctx context.Context) ([]appquery.CategoryInfo, error) {
	const query = `
		SELECT
			id,
			name
		FROM
			category
	`

	var categories []sqlxCategoryInfo
	err := c.client.SelectContext(ctx, &categories, query)
	if err != nil {
		return nil, err
	}

	var categoryInfos []appquery.CategoryInfo
	for _, category := range categories {
		categoryInfos = append(categoryInfos, appquery.CategoryInfo{
			ID:   category.ID,
			Name: category.Name,
		})
	}

	return categoryInfos, nil
}

type sqlxCategoryInfo struct {
	ID   int    `db:"id"`
	Name string `db:"name"`
}
