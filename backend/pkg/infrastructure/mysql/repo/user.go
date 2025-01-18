package repo

import (
	"context"
	"database/sql"
	"errors"
	"github.com/jmoiron/sqlx"

	"booklib/pkg/domain/model"
	"booklib/pkg/infrastructure/utils"
)

func NewUserRepository(
	ctx context.Context,
	client sqlx.DB,
) model.UserRepository {
	return &userRepository{
		ctx:    ctx,
		client: client,
	}
}

type userRepository struct {
	ctx    context.Context
	client sqlx.DB
}

func (repo *userRepository) NextID() (int, error) {
	const query = `
		SELECT COALESCE(MAX(id), 0) + 1 FROM user
	`

	var nextID int
	err := repo.client.QueryRowContext(repo.ctx, query).Scan(&nextID)
	if err != nil {
		return 0, err
	}

	return nextID, nil
}

func (repo *userRepository) Store(user model.User) error {
	const query = `
	    INSERT INTO 
	        user (
	            id,
	            first_name,
	            last_name,
	            email,
				password,
	            role,
	            avatar_path
	        )
		VALUES (?, ?, ?, ?, ?, ?, ?)
		ON DUPLICATE KEY UPDATE
			first_name = VALUES(first_name),
			last_name = VALUES(last_name),
			email = VALUES(email),
			role = VALUES(role),
			avatar_path = VALUES(avatar_path)
	`

	_, err := repo.client.ExecContext(
		repo.ctx,
		query,
		user.ID(),
		user.FirstName(),
		user.LastName(),
		user.Email(),
		user.Password(),
		user.Role(),
		user.AvatarPath(),
	)
	return err
}

func (repo *userRepository) GetID(email, password string) (int, error) {
	const query = `
		SELECT
			id, password
		FROM
			user
		WHERE
			email = ?
	`
	var cred sqlxUserCred
	err := repo.client.GetContext(repo.ctx, &cred, query, email)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return 0, errors.New(model.ErrInvalidLoginOrPassword.Error())
		}
		return 0, err
	}

	if !utils.CheckPassword(cred.Password, password) {
		return 0, errors.New(model.ErrInvalidLoginOrPassword.Error())
	}

	return cred.ID, nil
}

func (repo *userRepository) IsExist(email string) (bool, error) {
	const query = `
		SELECT COUNT(*) 
		FROM user 
		WHERE email = ?
	`

	var count int
	err := repo.client.GetContext(repo.ctx, &count, query, email)
	if err != nil {
		return false, err
	}

	return count > 0, nil
}

func (repo *userRepository) FindOne(id int) (model.User, error) {
	//TODO implement me
	panic("implement me")
}

func (repo *userRepository) FindAll(ids []int) ([]model.User, error) {
	//TODO implement me
	panic("implement me")
}

type sqlxUserCred struct {
	ID       int    `db:"id"`
	Password string `db:"password"`
}
