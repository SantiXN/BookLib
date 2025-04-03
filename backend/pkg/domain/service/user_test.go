package service

import (
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"

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
	existingUser := model.NewUser(0, firstName, &lastName, email, password, model.DefaultUser, &avatarPath)
	tests := []struct {
		name         string
		data         UserData
		want         UserData
		existingUser *model.User
		wantErr      bool
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
			want: UserData{
				FirstName:  firstName,
				LastName:   &lastName,
				Email:      email,
				Password:   password,
				Role:       model.DefaultUser,
				AvatarPath: &avatarPath,
			},
			existingUser: nil,
			wantErr:      false,
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
			existingUser: &existingUser,
			wantErr:      true,
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
			existingUser: nil,
			wantErr:      true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repository := newMockUserRepository([]*model.User{tt.existingUser})
			service := NewUserService(repository)

			id, err := service.CreateUser(tt.data)
			if tt.wantErr {
				assert.Error(t, err)
				return
			} else {
				assert.NoError(t, err)
			}

			user, err := repository.FindOne(id)
			assert.NoError(t, err)

			assert.Equal(t, tt.data.FirstName, user.FirstName())
			assert.Equal(t, tt.data.LastName, user.LastName())
			assert.Equal(t, tt.data.Email, user.Email())
			assert.Equal(t, tt.data.Role, user.Role())
			assert.Equal(t, tt.data.AvatarPath, user.AvatarPath())
		})
	}
}

func TestDeleteUser(t *testing.T) {
	existingUser := model.NewUser(0, firstName, &lastName, email, password, model.DefaultUser, &avatarPath)
	tests := []struct {
		name         string
		id           int
		existingUser *model.User
		wantErr      bool
	}{
		{
			name:         "successful delete user",
			id:           0,
			existingUser: &existingUser,
			wantErr:      false,
		},
		{
			name:         "failed delete non existent user",
			id:           0,
			existingUser: nil,
			wantErr:      true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repository := newMockUserRepository([]*model.User{tt.existingUser})
			service := NewUserService(repository)

			err := service.DeleteUser(tt.id)
			if tt.wantErr {
				assert.Error(t, err)
				return
			} else {
				assert.NoError(t, err)
			}

			exist, err := repository.IsUserExist(tt.id)
			assert.NoError(t, err)
			assert.False(t, exist)
		})
	}
}

func TestChangeRole(t *testing.T) {
	existingUser := model.NewUser(1, firstName, &lastName, email, password, model.DefaultUser, &avatarPath)
	tests := []struct {
		name         string
		id           int
		existingUser *model.User
		wantErr      bool
	}{
		{
			name:         "successful change role",
			id:           1,
			existingUser: &existingUser,
			wantErr:      false,
		},
		{
			name:         "failed change role with non existent user",
			id:           1,
			existingUser: nil,
			wantErr:      true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repository := newMockUserRepository([]*model.User{tt.existingUser})
			service := NewUserService(repository)

			err := service.ChangeRole(tt.id, model.DefaultUser)
			if tt.wantErr {
				assert.Error(t, err)
				return
			} else {
				assert.NoError(t, err)
			}

			user, err := repository.FindOne(tt.id)
			assert.NoError(t, err)
			assert.Equal(t, user.Role(), model.DefaultUser)
		})
	}
}

func TestEditUserInfo(t *testing.T) {
	existingUser := model.NewUser(1, firstName, &lastName, email, password, model.DefaultUser, &avatarPath)
	tests := []struct {
		name          string
		id            int
		newFirstName  string
		newLastName   string
		newAvatarPath string
		existingUser  *model.User
		wantErr       bool
	}{
		{
			name:          "successful edit info",
			id:            1,
			newFirstName:  "newFirstName",
			newLastName:   "newLastName",
			newAvatarPath: "newAvatarPath",
			existingUser:  &existingUser,
			wantErr:       false,
		},
		{
			name:         "failed edit info to non existent user",
			id:           1,
			existingUser: nil,
			wantErr:      true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repository := newMockUserRepository([]*model.User{tt.existingUser})
			service := NewUserService(repository)

			err := service.EditUserInfo(tt.id, &tt.newFirstName, &tt.newLastName, &tt.newAvatarPath)
			if tt.wantErr {
				assert.Error(t, err)
				return
			} else {
				assert.NoError(t, err)
			}

			user, err := repository.FindOne(tt.id)
			assert.NoError(t, err)
			assert.Equal(t, tt.newFirstName, user.FirstName())
			assert.Equal(t, tt.newLastName, *user.LastName())
			assert.Equal(t, tt.newAvatarPath, *user.AvatarPath())
		})
	}
}

func TestValidateUser(t *testing.T) {
	existingUser := model.NewUser(1, firstName, &lastName, email, password, model.DefaultUser, &avatarPath)
	tests := []struct {
		name         string
		id           int
		email        string
		password     string
		existingUser model.User
		wantErr      bool
	}{
		{
			name:         "successful validate user",
			id:           1,
			email:        existingUser.Email(),
			password:     existingUser.Password(),
			existingUser: existingUser,
			wantErr:      false,
		},
		{
			name:         "failed validate user with incorrect email",
			id:           1,
			email:        "incorrect email",
			password:     existingUser.Password(),
			existingUser: existingUser,
			wantErr:      true,
		},
		{
			name:         "failed validate user with incorrect password",
			id:           1,
			email:        existingUser.Email(),
			password:     "incorrect password",
			existingUser: existingUser,
			wantErr:      true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			repository := newMockUserRepository([]*model.User{&tt.existingUser})
			service := NewUserService(repository)

			_, err := service.ValidateUser(tt.email, tt.password)
			if tt.wantErr {
				assert.Error(t, err)
				return
			} else {
				assert.NoError(t, err)
			}

			user, err := repository.FindOne(tt.id)
			assert.NoError(t, err)
			assert.Equal(t, tt.email, user.Email())
			assert.Equal(t, tt.password, user.Password())
		})
	}
}

func newMockUserRepository(users []*model.User) *mockUserRepository {
	maxID := 0
	userMap := make(map[int]model.User)
	for _, userPtr := range users {
		if userPtr == nil {
			continue
		}
		user := *userPtr
		userMap[user.ID()] = user
		maxID = max(maxID, user.ID())
	}
	maxID++

	return &mockUserRepository{
		nextID:  maxID,
		userMap: userMap,
	}
}

type mockUserRepository struct {
	nextID  int
	userMap map[int]model.User
}

func (m *mockUserRepository) NextID() (int, error) {
	m.nextID++
	return m.nextID, nil
}

func (m *mockUserRepository) Store(user model.User) error {
	m.userMap[user.ID()] = user
	return nil
}

func (m *mockUserRepository) IsUserExist(id int) (bool, error) {
	_, ok := m.userMap[id]
	return ok, nil
}

func (m *mockUserRepository) IsEmailExist(email string) (bool, error) {
	for _, user := range m.userMap {
		if user.Email() == email {
			return true, nil
		}
	}

	return false, nil
}

func (m *mockUserRepository) GetID(email, password string) (int, error) {
	for _, user := range m.userMap {
		if user.Email() == email && user.Password() == password {
			return user.ID(), nil
		}
	}

	return 0, errors.New("user not found")
}

func (m *mockUserRepository) FindOne(id int) (model.User, error) {
	user, ok := m.userMap[id]
	if !ok {
		return nil, errors.New("user not found")
	}

	return user, nil
}

func (m *mockUserRepository) FindAll(ids []int) ([]model.User, error) {
	var users []model.User
	for _, id := range ids {
		user, ok := m.userMap[id]
		if ok {
			users = append(users, user)
		}
	}

	return users, nil
}

func (m *mockUserRepository) Delete(id int) error {
	delete(m.userMap, id)
	return nil
}
