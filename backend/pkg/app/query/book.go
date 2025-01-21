package query

import (
	"booklib/pkg/app/model"
	"booklib/pkg/app/service/provider"
	"context"
)

type BookQueryService interface {
	ListBooks(limit, offset *int)
	IsBookExist(ctx context.Context, bookID int) (bool, error)
	ListBooksByCategory(ctx context.Context, categoryID int, limit, offset *int) ([]model.Book, error)
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

func (b *bookQueryService) ListBooks(limit, offset *int) {
	//TODO implement me
	panic("implement me")
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
