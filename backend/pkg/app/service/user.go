package service

import (
	"booklib/pkg/infrastructure/utils"
	"context"

	"booklib/pkg/domain/model"
	"booklib/pkg/domain/service"
)

type UserData struct {
	FirstName  string
	LastName   *string
	Email      string
	Password   string
	Role       model.UserRole
	AvatarPath *string
}

type CreateData struct {
	FirstName string
	LastName  *string
	Email     string
	Password  string
}

type UserService interface {
	ValidateUser(email, password string) (int, error)
	CreateUser(createData CreateData) error
	DeleteUser(ctx context.Context, userId int) error
	ChangeRole(ctx context.Context, id int, role model.UserRole) error
	EditUserInfo(ctx context.Context, firstName *string, lastName *string) error
}

type userService struct {
	domainUserService service.UserService
	permissionChecker PermissionChecker
}

func NewUserService(
	domainUserService service.UserService,
	permissionChecker PermissionChecker,
) UserService {
	return &userService{
		domainUserService: domainUserService,
		permissionChecker: permissionChecker,
	}
}

func (u *userService) ValidateUser(email, password string) (int, error) {
	return u.domainUserService.ValidateUser(email, password)
}

func (u *userService) CreateUser(createData CreateData) error {
	return u.domainUserService.CreateUser(service.UserData{
		FirstName: createData.FirstName,
		LastName:  createData.LastName,
		Email:     createData.Email,
		Password:  createData.Password,
		Role:      model.DefaultUser,
	})
}

func (u *userService) DeleteUser(ctx context.Context, userId int) error {
	err := u.permissionChecker.AssertCanEditUser(ctx)
	if err != nil {
		return err
	}
	return u.domainUserService.DeleteUser(userId)
}

func (u *userService) ChangeRole(ctx context.Context, id int, role model.UserRole) error {
	err := u.permissionChecker.AssertCanEditUser(ctx)
	if err != nil {
		return err
	}

	return u.domainUserService.ChangeRole(id, role)
}

func (u *userService) EditUserInfo(ctx context.Context, firstName *string, lastName *string) error {
	id, err := utils.GetUserID(ctx)
	if err != nil {
		return err
	}

	return u.domainUserService.EditUserInfo(id, firstName, lastName)
}
