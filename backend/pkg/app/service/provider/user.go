package provider

import (
	"context"

	"booklib/pkg/domain/model"
)

type UserProvider interface {
	GetRole(ctx context.Context, id int) (model.UserRole, error)
}
