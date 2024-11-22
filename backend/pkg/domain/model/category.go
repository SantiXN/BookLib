package model

type CategoryRepository interface {
	FindOne(id int) (Category, error)
	FindAll(ids []int) ([]Category, error)
}

type Category interface {
	ID() int
	Name() string
}

func NewCategory(
	id int,
	name string,
) Category {
	return &category{
		id:   id,
		name: name,
	}
}

type category struct {
	id   int
	name string
}

func (c *category) ID() int {
	return c.id
}

func (c *category) Name() string {
	return c.name
}
