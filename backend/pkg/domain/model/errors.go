package model

import "errors"

var (
	ErrBookNotFound     = errors.New("book not found")
	ErrAuthorNotFound   = errors.New("author not found")
	ErrCategoryNotFound = errors.New("author not found")
)
