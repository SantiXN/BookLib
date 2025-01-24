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
	AssertCanModifyArticle(ctx context.Context, articleID int) error
	AssertCanCreateArticle(ctx context.Context) error
	AssertCanEditUser(ctx context.Context) error
	AssertCanWatchUserInfo(ctx context.Context) error
	AssertCanModifyBook(ctx context.Context) error
}

type permissionChecker struct {
	userProvider    provider.UserProvider
	articleProvider provider.ArticleProvider
}

func NewPermissionChecker(
	userProvider provider.UserProvider,
	articleProvider provider.ArticleProvider,
) PermissionChecker {
	return &permissionChecker{
		userProvider:    userProvider,
		articleProvider: articleProvider,
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

func (p *permissionChecker) AssertCanModifyBook(ctx context.Context) error {
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

func (p *permissionChecker) AssertCanModifyArticle(ctx context.Context, articleID int) error {
	id, err := utils.GetUserID(ctx)
	if err != nil {
		return err
	}
	role, err := p.userProvider.GetRole(ctx, id)
	if err != nil {
		return err
	}

	if role == model.DefaultUser {
		return ErrPermissionDenied
	}
	if role == model.Admin {
		return nil
	}

	isAuthor, err := p.articleProvider.IsAuthor(ctx, id, articleID)
	if err != nil {
		return err
	}

	if !isAuthor {
		return ErrPermissionDenied
	}

	return nil
}

func (p *permissionChecker) AssertCanCreateArticle(ctx context.Context) error {
	id, err := utils.GetUserID(ctx)
	if err != nil {
		return err
	}
	role, err := p.userProvider.GetRole(ctx, id)
	if err != nil {
		return err
	}

	if role == model.Admin || role == model.Editor {
		return nil
	}

	return ErrPermissionDenied
}
