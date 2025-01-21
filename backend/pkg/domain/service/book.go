package service

import "booklib/pkg/domain/model"

type BookData struct {
	Title       string
	Description *string
	FilePath    string
	CoverPath   *string
	AuthorIDs   []int
	CategoryIDs []int
	CreatedBy   int
}

type BookService interface {
	CreateBook(bookData BookData) (int, error)
	RemoveBook(id int) error
}

func NewBookService(
	bookRepository model.BookRepository,
) BookService {
	return &bookService{
		repo: bookRepository,
	}
}

type bookService struct {
	repo model.BookRepository
}

func (s *bookService) CreateBook(bookData BookData) (int, error) {
	id, err := s.repo.NextID()
	if err != nil {
		return 0, err
	}
	book := model.NewBook(
		id,
		bookData.Title,
		bookData.Description,
		bookData.FilePath,
		bookData.CoverPath,
		bookData.AuthorIDs,
		bookData.CategoryIDs,
		bookData.CreatedBy,
	)
	if err = s.repo.Store(book); err != nil {
		return 0, err
	}

	return id, nil
}

func (s *bookService) RemoveBook(id int) error {
	_, err := s.repo.FindOne(id)
	if err != nil {
		return err
	}
	return s.repo.Remove(id)
}
