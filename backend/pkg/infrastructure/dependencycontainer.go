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
	domainUserService := domainservice.NewUserService(userRepository)
	userProvider := provider.NewUserProvider(client)
	checker := service.NewPermissionChecker(userProvider)
	infraUserQS := infraquery.NewUserQueryService(client)

	userService := service.NewUserService(domainUserService, checker)
	userQueryService := query.NewUserQueryService(infraUserQS)

	return &DependencyContainer{
		UserService:      userService,
		UserQueryService: userQueryService,
	}
}

type DependencyContainer struct {
	UserService      service.UserService
	UserQueryService query.UserQueryService
}
