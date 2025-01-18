package service

import (
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
}

type userService struct {
	domainUserService service.UserService
}

func NewUserService(
	domainUserService service.UserService,
) UserService {
	return &userService{
		domainUserService: domainUserService,
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
