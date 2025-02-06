package query

import (
	appquery "booklib/pkg/app/query"
	"context"
	"database/sql"
	"errors"
	"fmt"
	"github.com/jmoiron/sqlx"
	"strings"
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

func (a *authorQueryService) SearchAuthors(ctx context.Context, searchString string, limit, offset *int) ([]appquery.AuthorInfo, error) {
	words := strings.Split(searchString, " ")

	var conditions []string
	var args []interface{}
	for _, word := range words {
		conditions = append(conditions, "(first_name LIKE ? OR last_name LIKE ?)")
		args = append(args, "%"+word+"%", "%"+word+"%")
	}

	conditionStr := strings.Join(conditions, " OR ")

	const baseQuery = `
        SELECT
            id,
            first_name,
            last_name,
            description,
            avatar_path
        FROM
            author
        WHERE
            %s
        ORDER BY
            first_name ASC
    `

	var query string
	if limit != nil && offset != nil {
		query = fmt.Sprintf(baseQuery, conditionStr) + " LIMIT ? OFFSET ?"
		args = append(args, *limit, *offset)
	} else {
		query = fmt.Sprintf(baseQuery, conditionStr)
	}

	var authors []sqlxAuthorInfo
	err := a.client.SelectContext(ctx, &authors, query, args...)
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

func (a *authorQueryService) GetTotalCountBySearchString(ctx context.Context, searchString string) (int, error) {
	words := strings.Split(searchString, " ")

	var conditions []string
	var args []interface{}
	for _, word := range words {
		conditions = append(conditions, "(first_name LIKE ? OR last_name LIKE ?)")
		args = append(args, "%"+word+"%", "%"+word+"%")
	}

	conditionStr := strings.Join(conditions, " OR ")

	const baseQuery = `
        SELECT
            COUNT(*)
        FROM
            author
        WHERE
            %s
    `

	query := fmt.Sprintf(baseQuery, conditionStr)

	var count int
	err := a.client.GetContext(ctx, &count, query, args...)
	if err != nil {
		return 0, err
	}

	return count, nil
}

type sqlxAuthorInfo struct {
	ID          int     `db:"id"`
	FirstName   string  `db:"first_name"`
	Lastname    *string `db:"last_name"`
	Description *string `db:"description"`
	AvatarPath  *string `db:"avatar_path"`
}
