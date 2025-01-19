package query

import (
	appquery "booklib/pkg/app/query"
	"context"
	"database/sql"
	"errors"
	"github.com/jmoiron/sqlx"
)

func NewAuthorQueryService(client sqlx.DB) appquery.AuthorQueryService {
	return &authorQueryService{
		client: client,
	}
}

type authorQueryService struct {
	client sqlx.DB
}

func (a *authorQueryService) GetAuthorInfo(ctx context.Context, id int) (appquery.AuthorInfo, error) {
	const query = `
		SELECT
			id,
			first_name,
			last_name,
			description,
			avatar_path
		FROM
			author
		WHERE
			id = ?
	`

	var author sqlxAuthorInfo
	err := a.client.GetContext(ctx, &author, query, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return appquery.AuthorInfo{}, errors.New(appquery.ErrAuthorNotFound.Error())
		}
		return appquery.AuthorInfo{}, err
	}

	return appquery.AuthorInfo{
		ID:          author.ID,
		FirstName:   author.FirstName,
		LastName:    author.Lastname,
		Description: author.Description,
		AvatarPath:  author.AvatarPath,
	}, nil
}

func (a *authorQueryService) ListAuthorInfo(ctx context.Context) ([]appquery.AuthorInfo, error) {
	const query = `
		SELECT
			id,
			first_name,
			last_name,
			description,
			avatar_path
		FROM
			author
	`

	var authors []sqlxAuthorInfo
	err := a.client.SelectContext(ctx, &authors, query)
	if err != nil {
		return nil, err
	}

	var authorInfos []appquery.AuthorInfo
	for _, author := range authors {
		authorInfos = append(authorInfos, appquery.AuthorInfo{
			ID:          author.ID,
			FirstName:   author.FirstName,
			LastName:    author.Lastname,
			Description: author.Description,
			AvatarPath:  author.AvatarPath,
		})
	}

	return authorInfos, nil
}

type sqlxAuthorInfo struct {
	ID          int     `db:"id"`
	FirstName   string  `db:"first_name"`
	Lastname    *string `db:"last_name"`
	Description *string `db:"description"`
	AvatarPath  *string `db:"avatar_path"`
}
