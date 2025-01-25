package service

import (
	"errors"

	"booklib/pkg/domain/model"
	"booklib/pkg/infrastructure/utils"
)

type UserData struct {
	FirstName  string
	LastName   *string
	Email      string
	Password   string
	Role       model.UserRole
	AvatarPath *string
}

type UserService interface {
	CreateUser(userData UserData) error
	DeleteUser(id int) error
	ChangeRole(id int, role model.UserRole) error
	EditUserInfo(id int, firstName *string, lastName *string, avatarPath *string) error
	ValidateUser(email, password string) (int, error)
}

func NewUserService(
	userRepository model.UserRepository,
) UserService {
	return &userService{
		repo: userRepository,
	}
}

type userService struct {
	repo model.UserRepository
}

func (u *userService) CreateUser(userData UserData) error {
	exist, err := u.repo.IsEmailExist(userData.Email)
	if err != nil {
		return err
	}
	if exist {
		return errors.New(model.ErrUserAlreadyExist.Error())
	}
	id, err := u.repo.NextID()
	if err != nil {
		return err
	}
	hashedPassword, err := utils.HashPassword(userData.Password)
	if err != nil {
		return err
	}
	user := model.NewUser(
		id,
		userData.FirstName,
		userData.LastName,
		userData.Email,
		hashedPassword,
		userData.Role,
		userData.AvatarPath,
	)

	return u.repo.Store(user)
}

func (u *userService) DeleteUser(id int) error {
	exist, err := u.repo.IsUserExist(id)
	if err != nil {
		return err
	}
	if !exist {
		return errors.New(model.ErrUserNotFound.Error())
	}
	return u.repo.Delete(id)
}

func (u *userService) ChangeRole(id int, role model.UserRole) error {
	user, err := u.repo.FindOne(id)
	if err != nil {
		return err
	}

	user.SetRole(role)
	return u.repo.Store(user)
}

func (u *userService) EditUserInfo(id int, firstName *string, lastName *string, avatarPath *string) error {
	user, err := u.repo.FindOne(id)
	if err != nil {
		return err
	}

	if firstName != nil {
		user.SetFirstName(*firstName)
	}
	if lastName != nil {
		user.SetLastName(*lastName)
	}
	if avatarPath != nil {
		user.SetAvatarPath(*avatarPath)
	}
	return u.repo.Store(user)
}

func (u *userService) ValidateUser(email, password string) (int, error) {
	return u.repo.GetID(email, password)
}
