package infrastructure

import (
	"context"
	"github.com/jmoiron/sqlx"

	"booklib/pkg/app/query"
	"booklib/pkg/app/service"
	domainservice "booklib/pkg/domain/service"
	"booklib/pkg/infrastructure/mysql/provider"
	infraquery "booklib/pkg/infrastructure/mysql/query"
	"booklib/pkg/infrastructure/mysql/repo"
)

func NewDependencyContainer(ctx context.Context, client sqlx.DB) *DependencyContainer {
	userRepository := repo.NewUserRepository(ctx, client)
	authorRepository := repo.NewAuthorRepository(ctx, client)
	domainUserService := domainservice.NewUserService(userRepository)
	domainAuthorService := domainservice.NewAuthorService(authorRepository)
	userProvider := provider.NewUserProvider(client)
	checker := service.NewPermissionChecker(userProvider)
	infraUserQS := infraquery.NewUserQueryService(client)
	infraAuthorQS := infraquery.NewAuthorQueryService(client)

	userService := service.NewUserService(domainUserService, checker)
	userQueryService := query.NewUserQueryService(infraUserQS, checker)
	authorService := service.NewAuthorService(domainAuthorService, checker)
	authorQueryService := query.NewAuthorQueryService(infraAuthorQS)

	return &DependencyContainer{
		UserService:        userService,
		UserQueryService:   userQueryService,
		AuthorService:      authorService,
		AuthorQueryService: authorQueryService,
	}
}

type DependencyContainer struct {
	UserService        service.UserService
	UserQueryService   query.UserQueryService
	AuthorService      service.AuthorService
	AuthorQueryService query.AuthorQueryService
}
