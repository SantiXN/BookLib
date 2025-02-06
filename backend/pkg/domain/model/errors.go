package model

import "errors"

var (
	ErrBookNotFound           = errors.New("book not found")
	ErrAuthorNotFound         = errors.New("author not found")
	ErrCategoryNotFound       = errors.New("author not found")
	ErrUserAlreadyExist       = errors.New("user already exist")
	ErrInvalidLoginOrPassword = errors.New("invalid login or password")
	ErrArticleNotFound        = errors.New("article not found")
	ErrUserNotFound           = errors.New("user not found")
)
