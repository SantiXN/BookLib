package model

type AuthorRepository interface {
	NextID() (int, error)
	Store(author Author) error
	FindOne(id int) (Author, error)
	FindAll(ids []int) ([]Author, error)
	Remove(id int) error
}

type Author interface {
	ID() int
	FirstName() string
	LastName() *string
	Description() *string
}

func NewAuthor(
	id int,
	firstName string,
	lastName *string,
	description *string,
) Author {
	return &author{
		id:          id,
		firstName:   firstName,
		lastName:    lastName,
		description: description,
	}
}

type author struct {
	id          int
	firstName   string
	lastName    *string
	description *string
}

func (a *author) ID() int {
	return a.id
}

func (a *author) FirstName() string {
	return a.firstName
}

func (a *author) LastName() *string {
	return a.lastName
}

func (a *author) Description() *string {
	return a.description
}
