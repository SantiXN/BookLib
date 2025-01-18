package service

import (
	"booklib/pkg/domain/model"
	"booklib/pkg/infrastructure/utils"
	"errors"
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
	exist, err := u.repo.IsExist(userData.Email)
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

func (u *userService) ValidateUser(email, password string) (int, error) {
	return u.repo.GetID(email, password)
}
