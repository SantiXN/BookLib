package query

import (
	"context"
	"database/sql"
	"errors"

	"github.com/jmoiron/sqlx"

	appquery "booklib/pkg/app/query"
	"booklib/pkg/domain/model"
)

func NewUserQueryService(client sqlx.DB) appquery.UserQueryService {
	return &userQueryService{
		client: client,
	}
}

type userQueryService struct {
	client sqlx.DB
}

func (c *userQueryService) GetUserInfo(ctx context.Context, id int) (appquery.UserInfo, error) {
	const query = `
		SELECT
			id,
			first_name,
			last_name,
			email,
			role,
			avatar_path
		FROM
			user
		WHERE
			id = ?
	`

	var user sqlxUserInfo
	err := c.client.GetContext(ctx, &user, query, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return appquery.UserInfo{}, errors.New(appquery.ErrUserNotFound.Error())
		}
		return appquery.UserInfo{}, err
	}

	return appquery.UserInfo{
		ID:         user.ID,
		FirstName:  user.FirstName,
		LastName:   user.Lastname,
		Email:      user.Email,
		Role:       model.UserRole(user.Role),
		AvatarPath: user.AvatarPath,
	}, nil
}

func (c *userQueryService) ListUserInfo(ctx context.Context) ([]appquery.UserInfo, error) {
	const query = `
		SELECT
			id,
			first_name,
			last_name,
			email,
			role,
			avatar_path
		FROM
			user
	`

	var users []sqlxUserInfo
	err := c.client.SelectContext(ctx, &users, query)
	if err != nil {
		return nil, err
	}

	var userInfos []appquery.UserInfo
	for _, user := range users {
		userInfos = append(userInfos, appquery.UserInfo{
			ID:         user.ID,
			FirstName:  user.FirstName,
			LastName:   user.Lastname,
			Email:      user.Email,
			Role:       model.UserRole(user.Role),
			AvatarPath: user.AvatarPath,
		})
	}

	return userInfos, nil
}

func (c *userQueryService) GetUserData(ctx context.Context, id int) (appquery.UserData, error) {
	const query = `
		SELECT
			id,
			first_name,
			last_name,
			avatar_path
		FROM
			user
		WHERE
			id = ?
	`

	var userData sqlxUserData
	err := c.client.GetContext(ctx, &userData, query, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return appquery.UserData{}, errors.New(appquery.ErrUserNotFound.Error())
		}
		return appquery.UserData{}, err
	}

	return appquery.UserData{
		ID:         userData.ID,
		FirstName:  userData.FirstName,
		LastName:   userData.Lastname,
		AvatarPath: userData.AvatarPath,
	}, nil
}

type sqlxUserInfo struct {
	ID         int     `db:"id"`
	FirstName  string  `db:"first_name"`
	Lastname   *string `db:"last_name"`
	Email      string  `db:"email"`
	Role       int     `db:"role"`
	AvatarPath *string `db:"avatar_path"`
}

type sqlxUserData struct {
	ID         int     `db:"id"`
	FirstName  string  `db:"first_name"`
	Lastname   *string `db:"last_name"`
	AvatarPath *string `db:"avatar_path"`
}
