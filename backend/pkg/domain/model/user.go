package model

type UserRepository interface {
	NextID() (int, error)
	Store(user User) error
	IsExist(email string) (bool, error)
	GetID(email, password string) (int, error)
	FindOne(id int) (User, error)
	FindAll(ids []int) ([]User, error)
}

type User interface {
	ID() int
	FirstName() string
	LastName() *string
	Email() string
	Password() string
	Role() UserRole
	AvatarPath() *string
}

type UserRole int

const (
	DefaultUser UserRole = iota
	Editor
	Admin
)

func NewUser(
	id int,
	firstName string,
	lastName *string,
	email string,
	password string,
	role UserRole,
	avatarPath *string,
) User {
	return &user{
		id:         id,
		firstName:  firstName,
		lastName:   lastName,
		email:      email,
		password:   password,
		role:       role,
		avatarPath: avatarPath,
	}
}

type user struct {
	id         int
	firstName  string
	lastName   *string
	email      string
	password   string
	role       UserRole
	avatarPath *string
}

func (u *user) ID() int {
	return u.id
}

func (u *user) FirstName() string {
	return u.firstName
}

func (u *user) LastName() *string {
	return u.lastName
}

func (u *user) Email() string {
	return u.email
}

func (u *user) Password() string {
	return u.password
}

func (u *user) Role() UserRole {
	return u.role
}

func (u *user) AvatarPath() *string {
	return u.avatarPath
}
