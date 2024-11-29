package service

import "booklib/pkg/domain/model"

type BookData struct {
	Title       string
	Description *string
	CoverPath   *string
	AuthorIDs   []int
	CategoryIDs []int
}

type BookService interface {
	CreateBook(bookData BookData) (int, error)
	RemoveBook(id int) error
}

func NewBookService(
	bookRepository model.BookRepository,
) BookService {
	return &service{
		repo: bookRepository,
	}
}

type service struct {
	repo model.BookRepository
}

func (s *service) CreateBook(bookData BookData) (int, error) {
	id, err := s.repo.NextID()
	if err != nil {
		return 0, err
	}
	book := model.NewBook(
		id,
		bookData.Title,
		bookData.Description,
		bookData.CoverPath,
		bookData.AuthorIDs,
		bookData.CategoryIDs,
	)
	if err = s.repo.Store(book); err != nil {
		return 0, err
	}

	return id, nil
}

func (s *service) RemoveBook(id int) error {
	return s.repo.Remove(id)
}
