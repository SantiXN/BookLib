package provider

import (
	"context"
	"database/sql"
	"errors"

	"github.com/jmoiron/sqlx"

	"booklib/pkg/app/model"
	"booklib/pkg/app/service/provider"
	domainmodel "booklib/pkg/domain/model"
)

func NewAuthorProvider(client sqlx.DB) provider.AuthorProvider {
	return &authorProvider{client: client}
}

type authorProvider struct {
	client sqlx.DB
}

func (a *authorProvider) GetAuthorsByBookID(ctx context.Context, bookID int) ([]model.Author, error) {
	const query = `
		SELECT
			au.id,
			au.first_name,
			au.last_name
		FROM
			author au
		JOIN
			author_book ab ON au.id = ab.author_id
		WHERE
			ab.book_id = ?
	`
	var authors []sqlxAuthor
	err := a.client.SelectContext(ctx, &authors, query, bookID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, domainmodel.ErrAuthorNotFound
		}
		return nil, err
	}

	result := make([]model.Author, 0, len(authors))
	for _, author := range authors {
		result = append(result, model.Author{
			ID:        author.ID,
			FirstName: author.FirstName,
			LastName:  author.LastName,
		})
	}

	return result, nil
}

type sqlxAuthor struct {
	ID        int     `db:"id"`
	FirstName string  `db:"first_name"`
	LastName  *string `db:"last_name"`
}
