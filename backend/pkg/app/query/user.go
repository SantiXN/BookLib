package query

import (
	"booklib/pkg/app/service"
	"booklib/pkg/domain/model"
	"context"
	"errors"
)

var ErrUserNotFound = errors.New("user not found")

type UserInfo struct {
	ID         int
	FirstName  string
	LastName   *string
	Email      string
	Role       model.UserRole
	AvatarPath *string
}

type UserData struct {
	ID         int
	FirstName  string
	LastName   *string
	AvatarPath *string
}

type UserQueryService interface {
	GetUserInfo(ctx context.Context, id int) (UserInfo, error)
	GetUserData(ctx context.Context, id int) (UserData, error)
	ListUserInfo(ctx context.Context) ([]UserInfo, error)
}

func NewUserQueryService(storageQueryService UserQueryService) UserQueryService {
	return &userQueryService{
		storageQueryService: storageQueryService,
	}
}

type userQueryService struct {
	storageQueryService UserQueryService
	permissionChecker   service.PermissionChecker
}

func (u *userQueryService) GetUserInfo(ctx context.Context, id int) (UserInfo, error) {
	return u.storageQueryService.GetUserInfo(ctx, id)
}

func (u *userQueryService) ListUserInfo(ctx context.Context) ([]UserInfo, error) {
	err := u.permissionChecker.AssertCanWatchUserInfo(ctx)
	if err != nil {
		return nil, err
	}
	return u.storageQueryService.ListUserInfo(ctx)
}

func (u *userQueryService) GetUserData(ctx context.Context, id int) (UserData, error) {
	return u.storageQueryService.GetUserData(ctx, id)
}
