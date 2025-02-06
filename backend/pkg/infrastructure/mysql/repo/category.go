package repo

import (
	"context"
	"database/sql"
	"errors"

	"github.com/jmoiron/sqlx"

	"booklib/pkg/domain/model"
)

func NewCategoryRepository(
	ctx context.Context,
	client sqlx.DB,
) model.CategoryRepository {
	return &categoryRepository{
		ctx:    ctx,
		client: client,
	}
}

type categoryRepository struct {
	ctx    context.Context
	client sqlx.DB
}

func (repo *categoryRepository) FindOne(id int) (model.Category, error) {
	const query = `
		SELECT
			id,
			name
		FROM
			category
		WHERE id = ?
	`
	var c sqlxCategory
	err := repo.client.GetContext(repo.ctx, &c, query, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, errors.New(model.ErrCategoryNotFound.Error())
		}
		return nil, err
	}

	return model.NewCategory(
		c.ID,
		c.Name,
	), nil
}

func (repo *categoryRepository) FindAll(ids []int) ([]model.Category, error) {
	if len(ids) == 0 {
		return nil, nil
	}
	const query = `
		SELECT
			id,
			name
		FROM
			category
		WHERE id IN (?)
	`
	inQuery, args, err := sqlx.In(query, ids)
	if err != nil {
		return nil, err
	}

	var sqlxCategories []sqlxCategory
	err = repo.client.SelectContext(repo.ctx, &sqlxCategories, inQuery, args...)
	if err != nil {
		return nil, err
	}

	var categories []model.Category
	for _, category := range sqlxCategories {
		categories = append(categories, model.NewCategory(category.ID, category.Name))
	}

	return categories, nil
}

type sqlxCategory struct {
	ID   int    `db:"id"`
	Name string `db:"name"`
}
