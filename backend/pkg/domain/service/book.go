package service

type BookData struct {
	Title       string
	Description *string
	CoverPath   *string
}

//TODO: подумать какие действия будут совершаться?

type BookService interface {
	CreateBook(bookData BookData) (int, error)
	RemoveBook(id int) error
}
