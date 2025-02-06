package model

type UserRepository interface {
	NextID() (int, error)
	Store(user User) error
	IsUserExist(id int) (bool, error)
	IsEmailExist(email string) (bool, error)
	GetID(email, password string) (int, error)
	FindOne(id int) (User, error)
	FindAll(ids []int) ([]User, error)
	Delete(id int) error
}

type User interface {
	ID() int
	FirstName() string
	LastName() *string
	Email() string
	Password() string
	Role() UserRole
	AvatarPath() *string

	SetRole(role UserRole)
	SetFirstName(firstName string)
	SetLastName(lastName string)
	SetAvatarPath(avatarPath string)
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

func (u *user) SetRole(role UserRole) {
	u.role = role
}

func (u *user) SetFirstName(firstName string) {
	u.firstName = firstName
}

func (u *user) SetLastName(lastName string) {
	u.lastName = &lastName
}

func (u *user) SetAvatarPath(avatarPath string) {
    u.avatarPath = &avatarPath
}
