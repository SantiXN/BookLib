package model

type BookRepository interface {
	NextID() (int, error)
	Store(book Book) error
	StoreAll(books []Book) error
	FindOne(id int) (Book, error)
	FindAll(ids []int) ([]Book, error)
	Remove(id int) error
}

//TODO добавить автора, категории. Подумать над путем к обложке

type Book interface {
	ID() int
	Title() string
	Description() *string
	CoverPath() *string
}

func NewBook(
	id int,
	title string,
	description *string,
	coverPath *string,
) Book {
	return &book{
		id:          id,
		title:       title,
		description: description,
		coverPath:   coverPath,
	}
}

type book struct {
	id          int
	title       string
	description *string
	coverPath   *string
}

func (b *book) ID() int {
	return b.id
}

func (b *book) Title() string {
	return b.title
}

func (b *book) Description() *string {
	return b.description
}

func (b *book) CoverPath() *string {
	return b.coverPath
}
