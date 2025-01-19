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
