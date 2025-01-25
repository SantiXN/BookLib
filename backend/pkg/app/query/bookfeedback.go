package query

import (
	"booklib/pkg/app/model"
	"context"
)

type BookFeedbackQueryService interface {
	ListFeedback(ctx context.Context, bookID int) ([]model.BookFeedbackItem, error)
}

func NewBookFeedbackQueryService(storageQueryService BookFeedbackQueryService) BookFeedbackQueryService {
	return &bookFeedbackQueryService{
		storageQueryService: storageQueryService,
	}
}

type bookFeedbackQueryService struct {
	storageQueryService BookFeedbackQueryService
}

func (b *bookFeedbackQueryService) ListFeedback(ctx context.Context, bookID int) ([]model.BookFeedbackItem, error) {
	return b.storageQueryService.ListFeedback(ctx, bookID)
}
