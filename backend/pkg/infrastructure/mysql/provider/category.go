package provider

import (
	"booklib/pkg/app/model"
	domainmodel "booklib/pkg/domain/model"
	"context"
	"database/sql"
	"errors"
	"github.com/jmoiron/sqlx"

	"booklib/pkg/app/service/provider"
)

func NewCategoryProvider(client sqlx.DB) provider.CategoryProvider {
	return &categoryProvider{client: client}
}

type categoryProvider struct {
	client sqlx.DB
}

func (c *categoryProvider) GetCategoriesByBook(ctx context.Context, bookID int) ([]model.Category, error) {
	const query = `
		SELECT
			c.id,
			c.name
		FROM
			category c
		JOIN
			category_book cb ON c.id = cb.category_id
		WHERE
			cb.book_id = ?
	`

	var categories []sqlxCategory
	err := c.client.SelectContext(ctx, &categories, query, bookID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, domainmodel.ErrCategoryNotFound
		}
		return nil, err
	}

	result := make([]model.Category, 0, len(categories))
	for _, category := range categories {
		result = append(result, model.Category{
			ID:   category.ID,
			Name: category.Name,
		})
	}

	return result, nil
}

type sqlxCategory struct {
	ID   int    `db:"id"`
	Name string `db:"name"`
}
