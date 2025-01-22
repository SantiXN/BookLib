package infrastructure

import (
	"booklib/pkg/infrastructure/mysql/storage"
	"context"

	"github.com/jmoiron/sqlx"

	"booklib/pkg/app/query"
	"booklib/pkg/app/service"
	domainservice "booklib/pkg/domain/service"
	"booklib/pkg/infrastructure/mysql/provider"
	infraquery "booklib/pkg/infrastructure/mysql/query"
	"booklib/pkg/infrastructure/mysql/repo"
)

const (
	saveDir = "/app/uploads"
)

func NewDependencyContainer(ctx context.Context, client sqlx.DB) *DependencyContainer {
	userRepository := repo.NewUserRepository(ctx, client)
	authorRepository := repo.NewAuthorRepository(ctx, client)
	bookRepository := repo.NewBookRepository(ctx, client)
	domainUserService := domainservice.NewUserService(userRepository)
	domainAuthorService := domainservice.NewAuthorService(authorRepository)
	domainBookService := domainservice.NewBookService(bookRepository)
	userProvider := provider.NewUserProvider(client)
	checker := service.NewPermissionChecker(userProvider)
	infraUserQS := infraquery.NewUserQueryService(client)
	infraAuthorQS := infraquery.NewAuthorQueryService(client)
	infraCategoryQS := infraquery.NewCategoryQueryService(client)
	infraUserBookQS := infraquery.NewUserBookQueryService(client)
	infraBookQs := infraquery.NewBookQueryService(client)

	userBookStorage := storage.NewUserBookStorage(ctx, client)
	authorProvider := provider.NewAuthorProvider(client)
	categoryProvider := provider.NewCategoryProvider(client)

	userService := service.NewUserService(domainUserService, checker)
	userQueryService := query.NewUserQueryService(infraUserQS, checker)
	authorService := service.NewAuthorService(domainAuthorService, checker)
	authorQueryService := query.NewAuthorQueryService(infraAuthorQS)
	categoryQueryService := query.NewCategoryQueryService(infraCategoryQS)
	fileService := service.NewFileService(saveDir)
	userBookService := service.NewUserBookService(userBookStorage)
	userBookQueryService := query.NewUserBookQueryService(infraUserBookQS, authorProvider)
	bookService := service.NewBookService(domainBookService, checker)
	bookQueryService := query.NewBookQueryService(infraBookQs, authorProvider, categoryProvider)

	return &DependencyContainer{
		UserService:          userService,
		UserQueryService:     userQueryService,
		AuthorService:        authorService,
		AuthorQueryService:   authorQueryService,
		CategoryQueryService: categoryQueryService,
		FileService:          fileService,
		UserBookService:      userBookService,
		UserBookQueryService: userBookQueryService,
		BookService:          bookService,
		BookQueryService:     bookQueryService,
	}
}

type DependencyContainer struct {
	UserService          service.UserService
	UserQueryService     query.UserQueryService
	AuthorService        service.AuthorService
	AuthorQueryService   query.AuthorQueryService
	CategoryQueryService query.CategoryQueryService
	FileService          service.FileService
	UserBookService      service.UserBookService
	UserBookQueryService query.UserBookQueryService
	BookService          service.BookService
	BookQueryService     query.BookQueryService
}
