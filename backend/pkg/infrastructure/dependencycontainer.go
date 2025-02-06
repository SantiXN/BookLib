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
	fileDir = "/uploads"
)

func NewDependencyContainer(ctx context.Context, client sqlx.DB) *DependencyContainer {
	userRepository := repo.NewUserRepository(ctx, client)
	authorRepository := repo.NewAuthorRepository(ctx, client)
	bookRepository := repo.NewBookRepository(ctx, client)
	articleRepository := repo.NewArticleRepository(ctx, client)

	domainUserService := domainservice.NewUserService(userRepository)
	domainAuthorService := domainservice.NewAuthorService(authorRepository)
	domainBookService := domainservice.NewBookService(bookRepository)
	domainArticleService := domainservice.NewArticleService(articleRepository)

	userProvider := provider.NewUserProvider(client)
	articleProvider := provider.NewArticleProvider(client)
	checker := service.NewPermissionChecker(userProvider, articleProvider)
	infraUserQS := infraquery.NewUserQueryService(client)
	infraAuthorQS := infraquery.NewAuthorQueryService(client)
	infraCategoryQS := infraquery.NewCategoryQueryService(client)
	infraUserBookQS := infraquery.NewUserBookQueryService(client)
	infraBookQs := infraquery.NewBookQueryService(client)
	infraArticleQS := infraquery.NewArticleQueryService(client)
	infraBookFeedbackQS := infraquery.NewBookFeedbackQueryService(client)

	userBookStorage := storage.NewUserBookStorage(ctx, client)
	bookFeedbackStorage := storage.NewBookFeedbackStorage(ctx, client)
	authorProvider := provider.NewAuthorProvider(client)
	categoryProvider := provider.NewCategoryProvider(client)

	userService := service.NewUserService(domainUserService, checker)
	userQueryService := query.NewUserQueryService(infraUserQS, checker)
	authorService := service.NewAuthorService(domainAuthorService, checker)
	authorQueryService := query.NewAuthorQueryService(infraAuthorQS)
	categoryQueryService := query.NewCategoryQueryService(infraCategoryQS)
	fileService := service.NewFileService(saveDir, fileDir)
	userBookService := service.NewUserBookService(userBookStorage)
	userBookQueryService := query.NewUserBookQueryService(infraUserBookQS, authorProvider)
	bookService := service.NewBookService(domainBookService, checker)
	bookQueryService := query.NewBookQueryService(infraBookQs, authorProvider, categoryProvider)
	articleService := service.NewArticleService(domainArticleService, checker)
	articleQueryService := query.NewArticleQueryService(infraArticleQS)
	bookFeedbackService := service.NewBookFeedbackService(bookFeedbackStorage)
	bookFeedbackQueryService := query.NewBookFeedbackQueryService(infraBookFeedbackQS)

	return &DependencyContainer{
		UserService:              userService,
		UserQueryService:         userQueryService,
		AuthorService:            authorService,
		AuthorQueryService:       authorQueryService,
		CategoryQueryService:     categoryQueryService,
		FileService:              fileService,
		UserBookService:          userBookService,
		UserBookQueryService:     userBookQueryService,
		BookService:              bookService,
		BookQueryService:         bookQueryService,
		ArticleService:           articleService,
		ArticleQueryService:      articleQueryService,
		BookFeedbackService:      bookFeedbackService,
		BookFeedbackQueryService: bookFeedbackQueryService,
	}
}

type DependencyContainer struct {
	UserService              service.UserService
	UserQueryService         query.UserQueryService
	AuthorService            service.AuthorService
	AuthorQueryService       query.AuthorQueryService
	CategoryQueryService     query.CategoryQueryService
	FileService              service.FileService
	UserBookService          service.UserBookService
	UserBookQueryService     query.UserBookQueryService
	BookService              service.BookService
	BookQueryService         query.BookQueryService
	ArticleService           service.ArticleService
	ArticleQueryService      query.ArticleQueryService
	BookFeedbackService      service.BookFeedbackService
	BookFeedbackQueryService query.BookFeedbackQueryService
}
