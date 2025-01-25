package query

import (
	"context"
	"errors"
)

var ErrAuthorNotFound = errors.New("author not found")

type AuthorInfo struct {
	ID          int
	FirstName   string
	LastName    *string
	Description *string
	AvatarPath  *string
}

type AuthorQueryService interface {
	GetAuthorInfo(ctx context.Context, id int) (AuthorInfo, error)
	ListAuthorInfo(ctx context.Context) ([]AuthorInfo, error)
	SearchAuthors(ctx context.Context, searchString string, limit, offset *int) ([]AuthorInfo, error)
	GetTotalCountBySearchString(ctx context.Context, searchString string) (int, error)
}

func NewAuthorQueryService(storageQueryService AuthorQueryService) AuthorQueryService {
	return &authorQueryService{
		storageQueryService: storageQueryService,
	}
}

type authorQueryService struct {
	storageQueryService AuthorQueryService
}

func (a *authorQueryService) GetAuthorInfo(ctx context.Context, id int) (AuthorInfo, error) {
	return a.storageQueryService.GetAuthorInfo(ctx, id)
}

func (a *authorQueryService) ListAuthorInfo(ctx context.Context) ([]AuthorInfo, error) {
	return a.storageQueryService.ListAuthorInfo(ctx)
}

func (a *authorQueryService) SearchAuthors(ctx context.Context, searchString string, limit, offset *int) ([]AuthorInfo, error) {
	return a.storageQueryService.SearchAuthors(ctx, searchString, limit, offset)
}

func (a *authorQueryService) GetTotalCountBySearchString(ctx context.Context, searchString string) (int, error) {
	return a.storageQueryService.GetTotalCountBySearchString(ctx, searchString)
}
