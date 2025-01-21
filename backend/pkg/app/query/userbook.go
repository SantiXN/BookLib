package query

import (
	"booklib/pkg/app/model"
	"booklib/pkg/app/service/provider"
	"context"
)

type UserBookQueryService interface {
	ListUserBooksByStatus(ctx context.Context, userID int, status model.ReadingStatus, limit, offset *int) ([]model.BookInLibrary, error)
	GetTotalCount(ctx context.Context, userID int, status model.ReadingStatus) (int, error)
	IsInLibrary(ctx context.Context, bookID, userID int) (bool, error)
}

func NewUserBookQueryService(storageQueryService UserBookQueryService, authorProvider provider.AuthorProvider) UserBookQueryService {
	return &userBookQueryService{
		storageQueryService: storageQueryService,
		authorProvider:      authorProvider,
	}
}

type userBookQueryService struct {
	storageQueryService UserBookQueryService
	authorProvider      provider.AuthorProvider
}

func (u *userBookQueryService) IsInLibrary(ctx context.Context, bookID, userID int) (bool, error) {
	return u.storageQueryService.IsInLibrary(ctx, bookID, userID)
}

func (u *userBookQueryService) ListUserBooksByStatus(ctx context.Context, userID int, status model.ReadingStatus, limit, offset *int) ([]model.BookInLibrary, error) {
	userBooks, err := u.storageQueryService.ListUserBooksByStatus(ctx, userID, status, limit, offset)
	if err != nil {
		return nil, err
	}

	for i, book := range userBooks {
		authors, err2 := u.authorProvider.GetAuthorsByBookID(ctx, book.BookID)
		if err2 != nil {
			return nil, err2
		}
		userBooks[i].Authors = authors
	}

	return userBooks, nil
}

func (u *userBookQueryService) GetTotalCount(ctx context.Context, userID int, status model.ReadingStatus) (int, error) {
	return u.storageQueryService.GetTotalCount(ctx, userID, status)
}
