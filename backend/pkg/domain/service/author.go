package service

import (
	"booklib/pkg/domain/model"
)

type AuthorData struct {
	FirstName   string
	LastName    *string
	Description *string
	AvatarPath  *string
}

type AuthorService interface {
	CreateAuthor(authorData AuthorData) (int, error)
	DeleteAuthor(id int) error
	EditAuthorInfo(id int, firstName *string, lastName *string, description *string) error
}

func NewAuthorService(
	authorRepository model.AuthorRepository,
) AuthorService {
	return &authorService{
		repo: authorRepository,
	}
}

type authorService struct {
	repo model.AuthorRepository
}

func (a *authorService) CreateAuthor(authorData AuthorData) (int, error) {
	id, err := a.repo.NextID()
	if err != nil {
		return 0, err
	}
	author := model.NewAuthor(
		id,
		authorData.FirstName,
		authorData.LastName,
		authorData.AvatarPath,
		authorData.Description,
	)

	err = a.repo.Store(author)
	if err != nil {
		return 0, err
	}
	return id, nil
}

func (a *authorService) DeleteAuthor(id int) error {
	_, err := a.repo.FindOne(id)
	if err != nil {
		return err
	}

	return a.repo.Remove(id)
}

func (a *authorService) EditAuthorInfo(id int, firstName *string, lastName *string, description *string) error {
	author, err := a.repo.FindOne(id)
	if err != nil {
		return err
	}

	if firstName != nil {
		author.SetFirstName(*firstName)
	}
	if lastName != nil {
		author.SetLastName(*lastName)
	}
	if description != nil {
		author.SetDescription(*description)
	}
	return a.repo.Store(author)
}
