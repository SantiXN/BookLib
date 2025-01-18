package infrastructure

import (
	"context"
	"github.com/jmoiron/sqlx"

	"booklib/pkg/app/service"
	domainservice "booklib/pkg/domain/service"
	"booklib/pkg/infrastructure/mysql/repo"
)

func NewDependencyContainer(ctx context.Context, client sqlx.DB) *DependencyContainer {
	userRepository := repo.NewUserRepository(ctx, client)
	domainUserService := domainservice.NewUserService(userRepository)

	userService := service.NewUserService(domainUserService)
	return &DependencyContainer{
		UserService: userService,
	}
}

type DependencyContainer struct {
	UserService service.UserService
}
