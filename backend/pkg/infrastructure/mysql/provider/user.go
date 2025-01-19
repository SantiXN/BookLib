package provider

import (
	"booklib/pkg/domain/model"
	"context"
	"database/sql"
	"errors"
	"github.com/jmoiron/sqlx"

	"booklib/pkg/app/service/provider"
)

func NewUserProvider(client sqlx.DB) provider.UserProvider {
	return &userProvider{client: client}
}

type userProvider struct {
	client sqlx.DB
}

func (u userProvider) GetRole(ctx context.Context, id int) (model.UserRole, error) {
	const query = `
		SELECT role
		FROM user
		WHERE id = ?
	`

	var role int
	err := u.client.GetContext(ctx, &role, query, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return 0, errors.New(model.ErrUserNotFound.Error())
		}
		return 0, err
	}

	return model.UserRole(role), nil
}
