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
	EditBook(id int, title *string, description *string, coverPath *string) error
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

func (s *bookService) EditBook(id int, title *string, description *string, coverPath *string) error {
	book, err := s.repo.FindOne(id)
	if err != nil {
		return err
	}

	if title != nil {
		book.SetTitle(*title)
	}
	if description != nil {
		book.SetDescription(*description)
	}
	if coverPath != nil {
		book.SetCoverPath(*coverPath)
	}

	return s.repo.Store(book)
}
