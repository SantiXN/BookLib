package service

import (
	"booklib/pkg/domain/service"
	"context"
)

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
	CreateBook(ctx context.Context, bookData BookData) (int, error)
}

type bookService struct {
	domainBookService service.BookService
	permissionChecker PermissionChecker
}

func NewBookService(
	domainBookService service.BookService,
	permissionChecker PermissionChecker,
) BookService {
	return &bookService{
		domainBookService: domainBookService,
		permissionChecker: permissionChecker,
	}
}

func (b *bookService) CreateBook(ctx context.Context, bookData BookData) (int, error) {
	err := b.permissionChecker.AssertCanAddBook(ctx)
	id, err := b.domainBookService.CreateBook(service.BookData{
		Title:       bookData.Title,
		Description: bookData.Description,
		FilePath:    bookData.FilePath,
		CoverPath:   bookData.CoverPath,
		AuthorIDs:   bookData.AuthorIDs,
		CategoryIDs: bookData.CategoryIDs,
		CreatedBy:   bookData.CreatedBy,
	})

	return id, err
}
