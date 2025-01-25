package query

import (
	"booklib/pkg/app/model"
	"booklib/pkg/app/service/provider"
	"context"
	"errors"
)

var ErrBookNotFound = errors.New("book not found")

type BookQueryService interface {
	IsBookExist(ctx context.Context, bookID int) (bool, error)
	ListBooksByCategory(ctx context.Context, categoryID int, limit, offset *int) ([]model.Book, error)
	ListBooksByAuthor(ctx context.Context, authorID int) ([]model.Book, error)
	GetBook(ctx context.Context, id int) (model.Book, error)
	GetTotalCountByCategory(ctx context.Context, categoryID int) (int, error)
	SearchBooks(ctx context.Context, searchString string, limit, offset *int) ([]model.Book, error)
	GetTotalCountBySearchString(ctx context.Context, searchString string) (int, error)
}

func NewBookQueryService(
	storageQueryService BookQueryService,
	authorProvider provider.AuthorProvider,
	categoryProvider provider.CategoryProvider,
) BookQueryService {
	return &bookQueryService{
		storageQueryService: storageQueryService,
		authorProvider:      authorProvider,
		categoryProvider:    categoryProvider,
	}
}

type bookQueryService struct {
	storageQueryService BookQueryService
	authorProvider      provider.AuthorProvider
	categoryProvider    provider.CategoryProvider
}

func (b *bookQueryService) GetTotalCountByCategory(ctx context.Context, categoryID int) (int, error) {
	return b.storageQueryService.GetTotalCountByCategory(ctx, categoryID)
}

func (b *bookQueryService) IsBookExist(ctx context.Context, bookID int) (bool, error) {
	return b.storageQueryService.IsBookExist(ctx, bookID)
}

func (b *bookQueryService) ListBooksByCategory(ctx context.Context, categoryID int, limit, offset *int) ([]model.Book, error) {
	books, err := b.storageQueryService.ListBooksByCategory(ctx, categoryID, limit, offset)
	if err != nil {
		return nil, err
	}

	for i, book := range books {
		authors, err2 := b.authorProvider.GetAuthorsByBookID(ctx, book.ID)
		if err2 != nil {
			return nil, err2
		}
		books[i].Authors = authors
	}

	return books, nil
}

func (b *bookQueryService) ListBooksByAuthor(ctx context.Context, authorID int) ([]model.Book, error) {
	books, err := b.storageQueryService.ListBooksByAuthor(ctx, authorID)
	if err != nil {
		return nil, err
	}

	for i, book := range books {
		authors, err2 := b.authorProvider.GetAuthorsByBookID(ctx, book.ID)
		if err2 != nil {
			return nil, err2
		}
		books[i].Authors = authors
	}

	return books, nil
}

func (b *bookQueryService) GetBook(ctx context.Context, id int) (model.Book, error) {
	book, err := b.storageQueryService.GetBook(ctx, id)
	if err != nil {
		return model.Book{}, err
	}

	authors, err := b.authorProvider.GetAuthorsByBookID(ctx, book.ID)
	if err != nil {
		return model.Book{}, err
	}
	book.Authors = authors

	categories, err := b.categoryProvider.GetCategoriesByBook(ctx, book.ID)
	if err != nil {
		return model.Book{}, err
	}
	book.Categories = categories

	return book, nil
}

func (b *bookQueryService) SearchBooks(ctx context.Context, searchString string, limit, offset *int) ([]model.Book, error) {
	books, err := b.storageQueryService.SearchBooks(ctx, searchString, limit, offset)
	if err != nil {
		return nil, err
	}
	for i, book := range books {
		authors, err2 := b.authorProvider.GetAuthorsByBookID(ctx, book.ID)
		if err2 != nil {
			return nil, err2
		}
		books[i].Authors = authors
	}
	return books, nil
}

func (b *bookQueryService) GetTotalCountBySearchString(ctx context.Context, searchString string) (int, error) {
	return b.storageQueryService.GetTotalCountBySearchString(ctx, searchString)
}
