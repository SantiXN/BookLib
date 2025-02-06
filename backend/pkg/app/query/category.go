package query

import (
	"context"
)

type CategoryInfo struct {
	ID   int
	Name string
}

type CategoryQueryService interface {
	ListCategories(ctx context.Context) ([]CategoryInfo, error)
}

func NewCategoryQueryService(storageQueryService CategoryQueryService) CategoryQueryService {
	return &categoryQueryService{
		storageQueryService: storageQueryService,
	}
}

type categoryQueryService struct {
	storageQueryService CategoryQueryService
}

func (c *categoryQueryService) ListCategories(ctx context.Context) ([]CategoryInfo, error) {
	return c.storageQueryService.ListCategories(ctx)
}
