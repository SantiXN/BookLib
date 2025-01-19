package service

import (
	"context"

	"booklib/pkg/domain/service"
)

type AuthorData struct {
	FirstName   string
	LastName    *string
	Description *string
	AvatarPath  *string
}

type AuthorService interface {
	CreateAuthor(ctx context.Context, authorData AuthorData) (int, error)
	DeleteAuthor(ctx context.Context, authorID int) error
	EditAuthorInfo(ctx context.Context, id int, firstName *string, lastName *string, description *string) error
}

type authorService struct {
	domainAuthorService service.AuthorService
	permissionChecker   PermissionChecker
}

func NewAuthorService(
	domainAuthorService service.AuthorService,
	permissionChecker PermissionChecker,
) AuthorService {
	return &authorService{
		domainAuthorService: domainAuthorService,
		permissionChecker:   permissionChecker,
	}
}

func (u *authorService) CreateAuthor(ctx context.Context, authorData AuthorData) (int, error) {
	err := u.permissionChecker.AssertCanEditUser(ctx)
	if err != nil {
		return 0, err
	}
	return u.domainAuthorService.CreateAuthor(service.AuthorData{
		FirstName:   authorData.FirstName,
		LastName:    authorData.LastName,
		Description: authorData.Description,
		AvatarPath:  authorData.AvatarPath,
	})
}

func (u *authorService) DeleteAuthor(ctx context.Context, authorID int) error {
	err := u.permissionChecker.AssertCanEditUser(ctx)
	if err != nil {
		return err
	}

	return u.domainAuthorService.DeleteAuthor(authorID)
}

func (u *authorService) EditAuthorInfo(ctx context.Context, id int, firstName *string, lastName *string, description *string) error {
	err := u.permissionChecker.AssertCanEditUser(ctx)
	if err != nil {
		return err
	}

	return u.domainAuthorService.EditAuthorInfo(id, firstName, lastName, description)
}
