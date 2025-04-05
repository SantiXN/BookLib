package service

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"

	"booklib/pkg/domain/model"
)

const (
	firstName    = "name"
	email        = "test@gmail.com"
	invalidEmail = "invalid"
	password     = "qwevbtfsa!!"
)

var (
	lastName   = "lastName"
	avatarPath = "path"
)

func TestCreateUser(t *testing.T) {
	tests := []struct {
		name        string
		data        UserData
		mockSetup   func(*mockUserRepository)
		expectedID  int
		expectedErr error
	}{
		{
			name: "successful create user with valid data",
			data: UserData{
				FirstName:  firstName,
				LastName:   &lastName,
				Email:      email,
				Password:   password,
				Role:       model.DefaultUser,
				AvatarPath: &avatarPath,
			},
			mockSetup: func(m *mockUserRepository) {
				m.On("IsEmailExist", email).Return(false, nil)
				m.On("NextID").Return(1, nil)
				m.On("Store", mock.AnythingOfType("*model.user")).Return(nil)
			},
			expectedID:  1,
			expectedErr: nil,
		},
		{
			name: "failed create user with existing email",
			data: UserData{
				FirstName:  firstName,
				LastName:   &lastName,
				Email:      email,
				Password:   password,
				Role:       model.DefaultUser,
				AvatarPath: &avatarPath,
			},
			mockSetup: func(m *mockUserRepository) {
				m.On("IsEmailExist", email).Return(true, nil)
			},
			expectedID:  0,
			expectedErr: model.ErrUserAlreadyExist,
		},
		{
			name: "failed create user with invalid email",
			data: UserData{
				FirstName:  firstName,
				LastName:   &lastName,
				Email:      invalidEmail,
				Password:   password,
				Role:       model.DefaultUser,
				AvatarPath: &avatarPath,
			},
			mockSetup: func(m *mockUserRepository) {
				m.On("IsEmailExist", invalidEmail).Return(false, nil)
			},
			expectedID:  0,
			expectedErr: model.ErrInvalidEmail,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := new(mockUserRepository)
			tt.mockSetup(repo)
			service := NewUserService(repo)

			id, err := service.CreateUser(tt.data)

			assert.Equal(t, tt.expectedID, id)
			if tt.expectedErr != nil {
				assert.EqualError(t, err, tt.expectedErr.Error())
			} else {
				assert.NoError(t, err)
			}
			repo.AssertExpectations(t)
		})
	}
}

func TestDeleteUser(t *testing.T) {
	tests := []struct {
		name        string
		id          int
		mockSetup   func(*mockUserRepository)
		expectedErr error
	}{
		{
			name: "successful delete user",
			id:   1,
			mockSetup: func(m *mockUserRepository) {
				m.On("IsUserExist", 1).Return(true, nil)
				m.On("Delete", 1).Return(nil)
			},
			expectedErr: nil,
		},
		{
			name: "failed delete non existent user",
			id:   1,
			mockSetup: func(m *mockUserRepository) {
				m.On("IsUserExist", 1).Return(false, nil)
			},
			expectedErr: model.ErrUserNotFound,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := new(mockUserRepository)
			tt.mockSetup(repo)
			service := NewUserService(repo)

			err := service.DeleteUser(tt.id)

			if tt.expectedErr != nil {
				assert.EqualError(t, err, tt.expectedErr.Error())
			} else {
				assert.NoError(t, err)
			}
			repo.AssertExpectations(t)
		})
	}
}

func TestChangeRole(t *testing.T) {
	user := model.NewUser(1, firstName, &lastName, email, password, model.DefaultUser, &avatarPath)
	tests := []struct {
		name        string
		id          int
		role        model.UserRole
		mockSetup   func(*mockUserRepository)
		expectedErr error
	}{
		{
			name: "successful change role",
			id:   1,
			role: model.Admin,
			mockSetup: func(m *mockUserRepository) {
				m.On("FindOne", 1).Return(user, nil)
				m.On("Store", mock.AnythingOfType("*model.user")).Return(nil)
			},
			expectedErr: nil,
		},
		{
			name: "failed change role with non existent user",
			id:   1,
			role: model.Admin,
			mockSetup: func(m *mockUserRepository) {
				m.On("FindOne", 1).Return(nil, model.ErrUserNotFound)
			},
			expectedErr: model.ErrUserNotFound,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := new(mockUserRepository)
			tt.mockSetup(repo)
			service := NewUserService(repo)

			err := service.ChangeRole(tt.id, tt.role)

			if tt.expectedErr != nil {
				assert.EqualError(t, err, tt.expectedErr.Error())
			} else {
				assert.NoError(t, err)
			}
			repo.AssertExpectations(t)
		})
	}
}

func TestEditUserInfo(t *testing.T) {
	user := model.NewUser(1, firstName, &lastName, email, password, model.DefaultUser, &avatarPath)
	newFirstName := "newFirstName"
	newLastName := "newLastName"
	newAvatarPath := "newAvatarPath"
	emptyString := ""

	tests := []struct {
		name        string
		id          int
		firstName   *string
		lastName    *string
		avatarPath  *string
		mockSetup   func(*mockUserRepository)
		expectedErr error
	}{
		{
			name:       "successful edit all info",
			id:         1,
			firstName:  &newFirstName,
			lastName:   &newLastName,
			avatarPath: &newAvatarPath,
			mockSetup: func(m *mockUserRepository) {
				m.On("FindOne", 1).Return(user, nil)
				m.On("Store", mock.AnythingOfType("*model.user")).Return(nil)
			},
			expectedErr: nil,
		},
		{
			name:       "successful edit first name only",
			id:         1,
			firstName:  &newFirstName,
			lastName:   nil,
			avatarPath: nil,
			mockSetup: func(m *mockUserRepository) {
				m.On("FindOne", 1).Return(user, nil)
				m.On("Store", mock.AnythingOfType("*model.user")).Return(nil)
			},
			expectedErr: nil,
		},
		{
			name:       "successful edit last name only",
			id:         1,
			firstName:  nil,
			lastName:   &newLastName,
			avatarPath: nil,
			mockSetup: func(m *mockUserRepository) {
				m.On("FindOne", 1).Return(user, nil)
				m.On("Store", mock.AnythingOfType("*model.user")).Return(nil)
			},
			expectedErr: nil,
		},
		{
			name:       "successful edit avatar path only",
			id:         1,
			firstName:  nil,
			lastName:   nil,
			avatarPath: &newAvatarPath,
			mockSetup: func(m *mockUserRepository) {
				m.On("FindOne", 1).Return(user, nil)
				m.On("Store", mock.AnythingOfType("*model.user")).Return(nil)
			},
			expectedErr: nil,
		},
		{
			name:       "failed edit info to non existent user",
			id:         1,
			firstName:  &newFirstName,
			lastName:   &newLastName,
			avatarPath: &newAvatarPath,
			mockSetup: func(m *mockUserRepository) {
				m.On("FindOne", 1).Return(nil, model.ErrUserNotFound)
			},
			expectedErr: model.ErrUserNotFound,
		},
		{
			name:       "failed edit first name to empty string",
			id:         1,
			firstName:  &emptyString,
			lastName:   nil,
			avatarPath: nil,
			mockSetup: func(m *mockUserRepository) {
				m.On("FindOne", 1).Return(user, nil)
			},
			expectedErr: model.ErrInvalidFirstName,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := new(mockUserRepository)
			tt.mockSetup(repo)
			service := NewUserService(repo)

			err := service.EditUserInfo(tt.id, tt.firstName, tt.lastName, tt.avatarPath)

			if tt.expectedErr != nil {
				assert.EqualError(t, err, tt.expectedErr.Error())
			} else {
				assert.NoError(t, err)
			}
			repo.AssertExpectations(t)
		})
	}
}

func TestValidateUser(t *testing.T) {
	tests := []struct {
		name        string
		email       string
		password    string
		mockSetup   func(*mockUserRepository)
		expectedID  int
		expectedErr error
	}{
		{
			name:     "successful validate user",
			email:    email,
			password: password,
			mockSetup: func(m *mockUserRepository) {
				m.On("GetID", email, password).Return(1, nil)
			},
			expectedID:  1,
			expectedErr: nil,
		},
		{
			name:     "failed validate user with incorrect email",
			email:    invalidEmail,
			password: password,
			mockSetup: func(m *mockUserRepository) {
				m.On("GetID", invalidEmail, password).Return(0, model.ErrUserNotFound)
			},
			expectedID:  0,
			expectedErr: model.ErrUserNotFound,
		},
		{
			name:     "failed validate user with incorrect password",
			email:    email,
			password: "invalidPassword",
			mockSetup: func(m *mockUserRepository) {
				m.On("GetID", email, "invalidPassword").Return(0, model.ErrUserNotFound)
			},
			expectedID:  0,
			expectedErr: model.ErrUserNotFound,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repo := new(mockUserRepository)
			tt.mockSetup(repo)
			service := NewUserService(repo)

			id, err := service.ValidateUser(tt.email, tt.password)

			assert.Equal(t, tt.expectedID, id)
			if tt.expectedErr != nil {
				assert.EqualError(t, err, tt.expectedErr.Error())
			} else {
				assert.NoError(t, err)
			}
			repo.AssertExpectations(t)
		})
	}
}

type mockUserRepository struct {
	mock.Mock
}

func (m *mockUserRepository) NextID() (int, error) {
	args := m.Called()
	return args.Int(0), args.Error(1)
}

func (m *mockUserRepository) Store(user model.User) error {
	args := m.Called(user)
	return args.Error(0)
}

func (m *mockUserRepository) IsUserExist(id int) (bool, error) {
	args := m.Called(id)
	return args.Bool(0), args.Error(1)
}

func (m *mockUserRepository) IsEmailExist(email string) (bool, error) {
	args := m.Called(email)
	return args.Bool(0), args.Error(1)
}

func (m *mockUserRepository) GetID(email, password string) (int, error) {
	args := m.Called(email, password)
	return args.Int(0), args.Error(1)
}

func (m *mockUserRepository) FindOne(id int) (model.User, error) {
	args := m.Called(id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(model.User), args.Error(1)
}

func (m *mockUserRepository) FindAll(ids []int) ([]model.User, error) {
	args := m.Called(ids)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]model.User), args.Error(1)
}

func (m *mockUserRepository) Delete(id int) error {
	args := m.Called(id)
	return args.Error(0)
}
