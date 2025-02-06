package query

import (
	"booklib/pkg/app/model"
	appquery "booklib/pkg/app/query"
	"context"
	"github.com/jmoiron/sqlx"
	"time"
)

func NewBookFeedbackQueryService(client sqlx.DB) appquery.BookFeedbackQueryService {
	return &bookFeedbackQueryService{
		client: client,
	}
}

type bookFeedbackQueryService struct {
	client sqlx.DB
}

func (b *bookFeedbackQueryService) ListFeedback(ctx context.Context, bookID int) ([]model.BookFeedbackItem, error) {
	const query = `
        SELECT 
            user_id,
            book_id,
            star_count,
            comment,
            created_at
        FROM 
            book_review
        WHERE 
            book_id = ?
        ORDER BY 
            created_at DESC
    `

	var feedbacks []sqlxBookFeedbackItem
	err := b.client.SelectContext(ctx, &feedbacks, query, bookID)
	if err != nil {
		return nil, err
	}

	var result []model.BookFeedbackItem
	for _, feedback := range feedbacks {
		result = append(result, model.BookFeedbackItem{
			UserID:    feedback.UserID,
			BookID:    feedback.BookID,
			StarCount: feedback.StarCount,
			Comment:   feedback.Comment,
			CreatedAt: feedback.CreatedAt,
		})
	}

	return result, nil
}

type sqlxBookFeedbackItem struct {
	UserID    int       `db:"user_id"`
	BookID    int       `db:"book_id"`
	StarCount int       `db:"star_count"`
	Comment   *string   `db:"comment"`
	CreatedAt time.Time `db:"created_at"`
}
