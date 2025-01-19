package service

import (
	"booklib/pkg/infrastructure/utils"
	"context"
	"errors"

	"booklib/pkg/app/service/provider"
	"booklib/pkg/domain/model"
)

var (
	ErrPermissionDenied = errors.New("permission denied")
)

type PermissionChecker interface {
	AssertCanEditUser(ctx context.Context) error
	AssertCanWatchUserInfo(ctx context.Context) error
}

type permissionChecker struct {
	userProvider provider.UserProvider
}

func NewPermissionChecker(
	userProvider provider.UserProvider,
) PermissionChecker {
	return &permissionChecker{
		userProvider: userProvider,
	}
}

func (p *permissionChecker) AssertCanEditUser(ctx context.Context) error {
	id, err := utils.GetUserID(ctx)
	if err != nil {
		return err
	}
	role, err := p.userProvider.GetRole(ctx, id)
	if err != nil {
		return err
	}

	if role != model.Admin {
		return ErrPermissionDenied
	}

	return nil
}

func (p *permissionChecker) AssertCanWatchUserInfo(ctx context.Context) error {
	id, err := utils.GetUserID(ctx)
	if err != nil {
		return err
	}
	role, err := p.userProvider.GetRole(ctx, id)
	if err != nil {
		return err
	}

	if role != model.Admin {
		return ErrPermissionDenied
	}

	return nil
}
