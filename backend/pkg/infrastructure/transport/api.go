package transport

import (
	"booklib/api"
	appmodel "booklib/pkg/app/model"
	"booklib/pkg/app/query"
	"booklib/pkg/app/service"
	"booklib/pkg/domain/model"
	"booklib/pkg/infrastructure/auth"
	"booklib/pkg/infrastructure/utils"
	"context"
	"errors"
	"math"
)

var (
	ErrInvalidRole              = errors.New("invalid role")
	ErrInvalidReadingStatus     = errors.New("invalid reading status")
	ErrInvalidUploadContentData = errors.New("invalid upload content data")
)

type API interface {
	api.StrictServerInterface
}

func NewPublicAPI(
	userService service.UserService,
	userQueryService query.UserQueryService,
	authorService service.AuthorService,
	authorQueryService query.AuthorQueryService,
	categoryQueryService query.CategoryQueryService,
	fileService service.FileService,
	userBookService service.UserBookService,
	userBookQueryService query.UserBookQueryService,
	bookService service.BookService,
	bookQueryService query.BookQueryService,
	articleService service.ArticleService,
	articleQueryService query.ArticleQueryService,
	bookFeedbackService service.BookFeedbackService,
	bookFeedbackQueryService query.BookFeedbackQueryService,
) API {
	return &publicAPI{
		userService:              userService,
		userQueryService:         userQueryService,
		authorService:            authorService,
		authorQueryService:       authorQueryService,
		categoryQueryService:     categoryQueryService,
		fileService:              fileService,
		userBookService:          userBookService,
		userBookQueryService:     userBookQueryService,
		bookService:              bookService,
		bookQueryService:         bookQueryService,
		articleService:           articleService,
		articleQueryService:      articleQueryService,
		bookFeedbackService:      bookFeedbackService,
		bookFeedbackQueryService: bookFeedbackQueryService,
	}
}

type publicAPI struct {
	userService              service.UserService
	userQueryService         query.UserQueryService
	authorService            service.AuthorService
	authorQueryService       query.AuthorQueryService
	categoryQueryService     query.CategoryQueryService
	fileService              service.FileService
	userBookService          service.UserBookService
	userBookQueryService     query.UserBookQueryService
	bookService              service.BookService
	bookQueryService         query.BookQueryService
	articleService           service.ArticleService
	articleQueryService      query.ArticleQueryService
	bookFeedbackService      service.BookFeedbackService
	bookFeedbackQueryService query.BookFeedbackQueryService
}

func (p *publicAPI) PublishArticle(ctx context.Context, request api.PublishArticleRequestObject) (api.PublishArticleResponseObject, error) {
	published := model.Published
	err := p.articleService.EditArticle(ctx, request.ArticleID, nil, nil, &published)
	if err != nil {
		return nil, err
	}

	return api.PublishArticle200Response{}, nil
}

func (p *publicAPI) CreateArticle(ctx context.Context, request api.CreateArticleRequestObject) (api.CreateArticleResponseObject, error) {
	userID, err := utils.GetUserID(ctx)
	if err != nil {
		return nil, err
	}
	id, err := p.articleService.CreateArticle(ctx, service.ArticleData{
		Title:    request.Body.Title,
		Content:  request.Body.Content,
		AuthorID: userID,
	})
	if err != nil {
		return nil, err
	}

	return api.CreateArticle200JSONResponse{
		Id: id,
	}, nil
}

func (p *publicAPI) ListArticles(ctx context.Context, request api.ListArticlesRequestObject) (api.ListArticlesResponseObject, error) {
	var offset *int
	if request.Params.Page != nil && request.Params.Limit != nil {
		page := *request.Params.Page
		limit := *request.Params.Limit
		offsetExpr := (page - 1) * limit
		offset = &offsetExpr
	}
	articles, err := p.articleQueryService.ListPublishedArticles(ctx, request.Params.Limit, offset)
	if err != nil {
		return nil, err
	}

	totalCount, err := p.articleQueryService.GetTotalCountPublishedArticles(ctx)
	if err != nil {
		return nil, err
	}

	var responseArticles []api.ArticleData
	for _, article := range articles {
		author, err := p.userQueryService.GetUserInfo(ctx, article.AuthorID)
		if err != nil {
			return nil, err
		}

		var publishDate *int64
		if article.PublishDate != nil {
			unixDate := article.PublishDate.Unix()
			publishDate = &unixDate
		}

		responseArticle := api.ArticleData{
			Id:    article.ID,
			Title: article.Title,
			Author: api.UserData{
				Id:        author.ID,
				FirstName: author.FirstName,
				LastName:  author.LastName,
			},
			Status:      toAPIArticleDataStatus(article.Status),
			PublishDate: publishDate,
		}

		responseArticles = append(responseArticles, responseArticle)
	}

	return api.ListArticles200JSONResponse{Articles: responseArticles, TotalCount: totalCount}, nil
}

func (p *publicAPI) ManagementArticles(ctx context.Context, request api.ManagementArticlesRequestObject) (api.ManagementArticlesResponseObject, error) {
	userID, err := utils.GetUserID(ctx)
	if err != nil {
		return nil, err
	}
	articles, err := p.articleQueryService.ListArticlesByAuthor(ctx, userID)
	if err != nil {
		return nil, err
	}

	var responseArticles []api.ArticleData
	for _, article := range articles {
		author, err := p.userQueryService.GetUserInfo(ctx, article.AuthorID)
		if err != nil {
			return nil, err
		}

		var publishDate *int64
		if article.PublishDate != nil {
			unixDate := article.PublishDate.Unix()
			publishDate = &unixDate
		}

		responseArticle := api.ArticleData{
			Id:    article.ID,
			Title: article.Title,
			Author: api.UserData{
				Id:        author.ID,
				FirstName: author.FirstName,
				LastName:  author.LastName,
			},
			Status:      toAPIArticleDataStatus(article.Status),
			PublishDate: publishDate,
		}

		responseArticles = append(responseArticles, responseArticle)
	}

	return api.ManagementArticles200JSONResponse{Articles: responseArticles}, nil
}

func (p *publicAPI) GetArticle(ctx context.Context, request api.GetArticleRequestObject) (api.GetArticleResponseObject, error) {
	article, err := p.articleQueryService.GetArticle(ctx, request.ArticleID)
	if err != nil {
		return nil, err
	}

	author, err := p.userQueryService.GetUserInfo(ctx, article.AuthorID)
	if err != nil {
		return nil, err
	}

	var publishDate *int64
	if article.PublishDate != nil {
		unixDate := article.PublishDate.Unix()
		publishDate = &unixDate
	}

	return api.GetArticle200JSONResponse{Article: api.ArticleInfo{
		Id:      article.ID,
		Title:   article.Title,
		Content: article.Content,
		Author: api.UserData{
			Id:        author.ID,
			FirstName: author.FirstName,
			LastName:  author.LastName,
		},
		Status:      toAPIArticleInfoStatus(article.Status),
		PublishDate: publishDate,
	}}, nil
}

func (p *publicAPI) DeleteArticle(ctx context.Context, request api.DeleteArticleRequestObject) (api.DeleteArticleResponseObject, error) {
	err := p.articleService.DeleteArticle(ctx, request.ArticleID)
	if err != nil {
		return nil, err
	}

	return api.DeleteArticle200Response{}, nil
}

func (p *publicAPI) EditArticle(ctx context.Context, request api.EditArticleRequestObject) (api.EditArticleResponseObject, error) {
	err := p.articleService.EditArticle(ctx, request.ArticleID, request.Body.NewTitle, request.Body.NewContent, nil)
	if err != nil {
		return nil, err
	}

	return api.EditArticle200Response{}, nil
}

func (p *publicAPI) CreateAuthor(ctx context.Context, request api.CreateAuthorRequestObject) (api.CreateAuthorResponseObject, error) {
	id, err := p.authorService.CreateAuthor(ctx, service.AuthorData{
		FirstName:   request.Body.FirstName,
		LastName:    request.Body.LastName,
		Description: request.Body.Description,
	})
	if err != nil {
		return nil, err
	}

	return api.CreateAuthor200JSONResponse{
		Id: id,
	}, nil
}

func (p *publicAPI) ListAuthors(ctx context.Context, request api.ListAuthorsRequestObject) (api.ListAuthorsResponseObject, error) {
	authorInfos, err := p.authorQueryService.ListAuthorInfo(ctx)
	if err != nil {
		return nil, err
	}

	apiAuthors := make([]api.AuthorInfo, 0, len(authorInfos))
	for _, authorInfo := range authorInfos {
		apiAuthor := toAPIAuthorInfo(authorInfo)
		apiAuthors = append(apiAuthors, apiAuthor)
	}

	return api.ListAuthors200JSONResponse{
		Authors: apiAuthors,
	}, nil

}

func (p *publicAPI) CheckBookInLibrary(ctx context.Context, request api.CheckBookInLibraryRequestObject) (api.CheckBookInLibraryResponseObject, error) {
	userID, err := utils.GetUserID(ctx)
	if err != nil {
		return nil, err
	}

	inLib, err := p.userBookQueryService.IsInLibrary(ctx, request.BookID, userID)
	if err != nil {
		return nil, err
	}

	return api.CheckBookInLibrary200JSONResponse{Contains: inLib}, nil
}

func (p *publicAPI) DeleteAuthor(ctx context.Context, request api.DeleteAuthorRequestObject) (api.DeleteAuthorResponseObject, error) {
	err := p.authorService.DeleteAuthor(ctx, request.AuthorID)
	if err != nil {
		return nil, err
	}

	return api.DeleteAuthor200Response{}, nil
}

func (p *publicAPI) EditAuthor(ctx context.Context, request api.EditAuthorRequestObject) (api.EditAuthorResponseObject, error) {
	err := p.authorService.EditAuthorInfo(ctx, request.AuthorID, request.Body.NewFirstName, request.Body.NewLastName, request.Body.NewDescription)
	if err != nil {
		return nil, err
	}

	return api.EditAuthor200Response{}, nil
}

func (p *publicAPI) GetAuthorInfo(ctx context.Context, request api.GetAuthorInfoRequestObject) (api.GetAuthorInfoResponseObject, error) {
	authorInfo, err := p.authorQueryService.GetAuthorInfo(ctx, request.AuthorID)
	if err != nil {
		return nil, err
	}

	return api.GetAuthorInfo200JSONResponse{
		Author: toAPIAuthorInfo(authorInfo),
	}, nil
}

func (p *publicAPI) AddBook(ctx context.Context, request api.AddBookRequestObject) (api.AddBookResponseObject, error) {
	userID, err := utils.GetUserID(ctx)
	if err != nil {
		return nil, err
	}
	id, err := p.bookService.CreateBook(ctx, service.BookData{
		Title:       request.Body.Title,
		Description: request.Body.Description,
		FilePath:    request.Body.FilePath,
		CoverPath:   request.Body.CoverPath,
		AuthorIDs:   request.Body.AuthorIDs,
		CategoryIDs: request.Body.CategoryIDs,
		CreatedBy:   userID,
	})
	if err != nil {
		return nil, err
	}

	return api.AddBook200JSONResponse{Id: id}, nil
}

func (p *publicAPI) ListLibraryBooksByStatus(ctx context.Context, request api.ListLibraryBooksByStatusRequestObject) (api.ListLibraryBooksByStatusResponseObject, error) {
	id, err := utils.GetUserID(ctx)
	if err != nil {
		return nil, err
	}

	var status appmodel.ReadingStatus
	switch request.Body.ReadingStatus {
	case api.ListLibraryBooksByStatusRequestReadingStatusFinished:
		status = appmodel.Finished
	case api.ListLibraryBooksByStatusRequestReadingStatusPlanned:
		status = appmodel.Planned
	case api.ListLibraryBooksByStatusRequestReadingStatusInProgress:
		status = appmodel.InProgress
	}

	var offset *int
	if request.Params.Page != nil && request.Params.Limit != nil {
		page := *request.Params.Page
		limit := *request.Params.Limit
		offsetExpr := (page - 1) * limit
		offset = &offsetExpr
	}
	books, err := p.userBookQueryService.ListUserBooksByStatus(ctx, id, status, request.Params.Limit, offset)
	if err != nil {
		return nil, err
	}

	totalCount, err := p.userBookQueryService.GetTotalCount(ctx, id, status)
	if err != nil {
		return nil, err
	}

	apiBooks := make([]api.BookInLibrary, 0, len(books))
	for _, book := range books {
		apiBook := api.BookInLibrary{
			Id:            book.BookID,
			Title:         book.Title,
			CoverPath:     book.CoverPath,
			StarCount:     float32(math.Round(float64(book.StarCount)*10) / 10),
			ReadingStatus: toBookInLibReadingStatus(book.ReadingStatus),
		}

		authors := book.Authors
		apiAuthors := make([]api.AuthorInfo, 0, len(authors))
		for _, author := range authors {
			apiAuthor := api.AuthorInfo{
				Id:        author.ID,
				FirstName: author.FirstName,
				LastName:  author.LastName,
			}

			apiAuthors = append(apiAuthors, apiAuthor)
		}
		apiBook.Authors = apiAuthors

		apiBooks = append(apiBooks, apiBook)
	}

	return api.ListLibraryBooksByStatus200JSONResponse{
		Books:       apiBooks,
		TotalNumber: totalCount,
	}, nil
}

func (p *publicAPI) ListAuthorBooks(ctx context.Context, request api.ListAuthorBooksRequestObject) (api.ListAuthorBooksResponseObject, error) {
	books, err := p.bookQueryService.ListBooksByAuthor(ctx, request.AuthorID)
	if err != nil {
		return nil, err
	}

	apiBooks := make([]api.BookData, 0, len(books))
	for _, book := range books {
		apiBook := api.BookData{
			Id:        book.ID,
			Title:     book.Title,
			CoverPath: book.CoverPath,
			StarCount: float32(math.Round(float64(book.StarCount)*10) / 10),
		}

		authors := book.Authors
		apiAuthors := make([]api.AuthorInfo, 0, len(authors))
		for _, author := range authors {
			apiAuthor := api.AuthorInfo{
				Id:        author.ID,
				FirstName: author.FirstName,
				LastName:  author.LastName,
			}

			apiAuthors = append(apiAuthors, apiAuthor)
		}
		apiBook.Authors = apiAuthors

		apiBooks = append(apiBooks, apiBook)
	}

	return api.ListAuthorBooks200JSONResponse{Books: apiBooks}, nil
}

func (p *publicAPI) DeleteBook(ctx context.Context, request api.DeleteBookRequestObject) (api.DeleteBookResponseObject, error) {
	err := p.bookService.DeleteBook(ctx, request.BookID)
	if err != nil {
		return nil, err
	}

	return api.DeleteBook200Response{}, nil
}

func (p *publicAPI) EditBook(ctx context.Context, request api.EditBookRequestObject) (api.EditBookResponseObject, error) {
	err := p.bookService.EditBookInfo(ctx, request.BookID, request.Body.NewTitle, request.Body.NewDescription, nil)
	if err != nil {
		return nil, err
	}

	return api.EditBook200Response{}, nil
}

func (p *publicAPI) SaveBookFeedback(ctx context.Context, request api.SaveBookFeedbackRequestObject) (api.SaveBookFeedbackResponseObject, error) {
	userID, err := utils.GetUserID(ctx)
	if err != nil {
		return nil, err
	}

	err = p.bookFeedbackService.SaveFeedback(appmodel.BookFeedback{
		UserID:    userID,
		BookID:    request.BookID,
		StarCount: request.Body.StarCount,
		Comment:   request.Body.Comment,
	})
	if err != nil {
		return nil, err
	}

	return api.SaveBookFeedback200Response{}, nil
}

func (p *publicAPI) ListBookFeedback(ctx context.Context, request api.ListBookFeedbackRequestObject) (api.ListBookFeedbackResponseObject, error) {
	feedbackList, err := p.bookFeedbackQueryService.ListFeedback(ctx, request.BookID)
	if err != nil {
		return nil, err
	}

	apiFeedbackList := make([]api.FeedbackInfo, 0, len(feedbackList))
	for _, feedback := range feedbackList {
		apiFeedback := api.FeedbackInfo{
			Comment:   feedback.Comment,
			StarCount: feedback.StarCount,
			PostedAt:  feedback.CreatedAt.Unix(),
		}
		user, err2 := p.userQueryService.GetUserData(ctx, feedback.UserID)
		if err2 != nil {
			return nil, err2
		}
		apiFeedback.User = api.UserData{
			Id:         user.ID,
			FirstName:  user.FirstName,
			LastName:   user.LastName,
			AvatarPath: user.AvatarPath,
		}
		apiFeedbackList = append(apiFeedbackList, apiFeedback)
	}

	return api.ListBookFeedback200JSONResponse{Feedback: apiFeedbackList}, nil
}

func (p *publicAPI) GetBookInfo(ctx context.Context, request api.GetBookInfoRequestObject) (api.GetBookInfoResponseObject, error) {
	book, err := p.bookQueryService.GetBook(ctx, request.BookID)
	if err != nil {
		return nil, err
	}

	apiAuthors := make([]api.AuthorInfo, 0, len(book.Authors))
	for _, author := range book.Authors {
		apiAuthor := api.AuthorInfo{
			Id:        author.ID,
			FirstName: author.FirstName,
			LastName:  author.LastName,
		}
		apiAuthors = append(apiAuthors, apiAuthor)
	}
	apiCategories := make([]api.CategoryInfo, 0, len(book.Categories))
	for _, category := range book.Categories {
		apiCategory := api.CategoryInfo{
			Id:       category.ID,
			Category: category.Name,
		}
		apiCategories = append(apiCategories, apiCategory)
	}

	return api.GetBookInfo200JSONResponse{Book: api.BookInfo{
		Id:          book.ID,
		Title:       book.Title,
		Description: book.Description,
		FilePath:    book.FilePath,
		CoverPath:   book.CoverPath,
		StarCount:   float32(math.Round(float64(book.StarCount)*10) / 10),
		Authors:     apiAuthors,
		Categories:  apiCategories,
	}}, nil

}

func (p *publicAPI) AddBookToLibrary(ctx context.Context, request api.AddBookToLibraryRequestObject) (api.AddBookToLibraryResponseObject, error) {
	id, err := utils.GetUserID(ctx)
	if err != nil {
		return nil, err
	}

	err = p.userBookService.AddBookToLibrary(id, request.BookID)
	if err != nil {
		return nil, err
	}

	return api.AddBookToLibrary200Response{}, nil
}

func (p *publicAPI) RemoveBookFromLibrary(ctx context.Context, request api.RemoveBookFromLibraryRequestObject) (api.RemoveBookFromLibraryResponseObject, error) {
	id, err := utils.GetUserID(ctx)
	if err != nil {
		return nil, err
	}

	err = p.userBookService.RemoveBookFromLibrary(id, request.BookID)
	if err != nil {
		return nil, err
	}

	return api.RemoveBookFromLibrary200Response{}, nil
}

func (p *publicAPI) ChangeReadingStatus(ctx context.Context, request api.ChangeReadingStatusRequestObject) (api.ChangeReadingStatusResponseObject, error) {
	id, err := utils.GetUserID(ctx)
	if err != nil {
		return nil, err
	}

	status, err := toReadingStatus(request.Body.ReadingStatus)
	if err != nil {
		return nil, err
	}

	err = p.userBookService.ChangeReadingStatus(appmodel.UserBook{
		UserID: id,
		BookID: request.BookID,
		Status: status,
	})
	if err != nil {
		return nil, err
	}

	return api.ChangeReadingStatus200Response{}, nil
}

func (p *publicAPI) ListBooksByCategory(ctx context.Context, request api.ListBooksByCategoryRequestObject) (api.ListBooksByCategoryResponseObject, error) {
	var offset *int
	if request.Params.Page != nil && request.Params.Limit != nil {
		page := *request.Params.Page
		limit := *request.Params.Limit
		offsetExpr := (page - 1) * limit
		offset = &offsetExpr
	}
	books, err := p.bookQueryService.ListBooksByCategory(ctx, request.CategoryID, request.Params.Limit, offset)
	if err != nil {
		return nil, err
	}
	totalCount, err := p.bookQueryService.GetTotalCountByCategory(ctx, request.CategoryID)
	if err != nil {
		return nil, err
	}

	apiBooks := make([]api.BookData, 0, len(books))
	for _, book := range books {
		apiBook := api.BookData{
			Id:        book.ID,
			Title:     book.Title,
			CoverPath: book.CoverPath,
			StarCount: float32(math.Round(float64(book.StarCount)*10) / 10),
		}

		authors := book.Authors
		apiAuthors := make([]api.AuthorInfo, 0, len(authors))
		for _, author := range authors {
			apiAuthor := api.AuthorInfo{
				Id:        author.ID,
				FirstName: author.FirstName,
				LastName:  author.LastName,
			}

			apiAuthors = append(apiAuthors, apiAuthor)
		}
		apiBook.Authors = apiAuthors

		apiBooks = append(apiBooks, apiBook)
	}

	return api.ListBooksByCategory200JSONResponse{Books: apiBooks, TotalCount: totalCount}, nil
}

func (p *publicAPI) ListCategories(ctx context.Context, request api.ListCategoriesRequestObject) (api.ListCategoriesResponseObject, error) {
	categories, err := p.categoryQueryService.ListCategories(ctx)
	if err != nil {
		return nil, err
	}

	apiCategories := make([]api.CategoryInfo, 0, len(categories))
	for _, category := range categories {
		apiCategory := api.CategoryInfo{
			Id:       category.ID,
			Category: category.Name,
		}
		apiCategories = append(apiCategories, apiCategory)
	}

	return api.ListCategories200JSONResponse{
		Categories: apiCategories,
	}, nil
}

func (p *publicAPI) SearchArticles(ctx context.Context, request api.SearchArticlesRequestObject) (api.SearchArticlesResponseObject, error) {
	var offset *int
	if request.Params.Page != nil && request.Params.Limit != nil {
		page := *request.Params.Page
		limit := *request.Params.Limit
		offsetExpr := (page - 1) * limit
		offset = &offsetExpr
	}
	articles, err := p.articleQueryService.SearchArticles(ctx, request.Body.SearchString, request.Params.Limit, offset)
	if err != nil {
		return nil, err
	}
	totlaCount, err := p.articleQueryService.GetTotalCountBySearch(ctx, request.Body.SearchString)
	if err != nil {
		return nil, err
	}

	var responseArticles []api.ArticleData
	for _, article := range articles {
		author, err := p.userQueryService.GetUserInfo(ctx, article.AuthorID)
		if err != nil {
			return nil, err
		}

		var publishDate *int64
		if article.PublishDate != nil {
			unixDate := article.PublishDate.Unix()
			publishDate = &unixDate
		}

		responseArticle := api.ArticleData{
			Id:    article.ID,
			Title: article.Title,
			Author: api.UserData{
				Id:        author.ID,
				FirstName: author.FirstName,
				LastName:  author.LastName,
			},
			Status:      toAPIArticleDataStatus(article.Status),
			PublishDate: publishDate,
		}

		responseArticles = append(responseArticles, responseArticle)
	}

	return api.SearchArticles200JSONResponse{Articles: responseArticles, TotalCount: totlaCount}, nil
}

func (p *publicAPI) SearchAuthors(ctx context.Context, request api.SearchAuthorsRequestObject) (api.SearchAuthorsResponseObject, error) {
	var offset *int
	if request.Params.Page != nil && request.Params.Limit != nil {
		page := *request.Params.Page
		limit := *request.Params.Limit
		offsetExpr := (page - 1) * limit
		offset = &offsetExpr
	}
	authors, err := p.authorQueryService.SearchAuthors(ctx, request.Body.SearchString, request.Params.Limit, offset)
	if err != nil {
		return nil, err
	}
	totalCount, err := p.authorQueryService.GetTotalCountBySearchString(ctx, request.Body.SearchString)
	if err != nil {
		return nil, err
	}

	apiAuthors := make([]api.AuthorInfo, 0, len(authors))
	for _, authorInfo := range authors {
		apiAuthor := toAPIAuthorInfo(authorInfo)
		apiAuthors = append(apiAuthors, apiAuthor)
	}

	return api.SearchAuthors200JSONResponse{Authors: apiAuthors, TotalCount: totalCount}, nil
}

func (p *publicAPI) SearchBooks(ctx context.Context, request api.SearchBooksRequestObject) (api.SearchBooksResponseObject, error) {
	var offset *int
	if request.Params.Page != nil && request.Params.Limit != nil {
		page := *request.Params.Page
		limit := *request.Params.Limit
		offsetExpr := (page - 1) * limit
		offset = &offsetExpr
	}
	books, err := p.bookQueryService.SearchBooks(ctx, request.Body.SearchString, request.Params.Limit, offset)
	if err != nil {
		return nil, err
	}
	totalCount, err := p.bookQueryService.GetTotalCountBySearchString(ctx, request.Body.SearchString)
	if err != nil {
		return nil, err
	}
	apiBooks := make([]api.BookData, 0, len(books))
	for _, book := range books {
		apiBook := api.BookData{
			Id:        book.ID,
			Title:     book.Title,
			CoverPath: book.CoverPath,
			StarCount: float32(math.Round(float64(book.StarCount)*10) / 10),
		}

		authors := book.Authors
		apiAuthors := make([]api.AuthorInfo, 0, len(authors))
		for _, author := range authors {
			apiAuthor := api.AuthorInfo{
				Id:        author.ID,
				FirstName: author.FirstName,
				LastName:  author.LastName,
			}

			apiAuthors = append(apiAuthors, apiAuthor)
		}
		apiBook.Authors = apiAuthors

		apiBooks = append(apiBooks, apiBook)
	}

	return api.SearchBooks200JSONResponse{Books: apiBooks, TotalCount: totalCount}, nil
}

func (p *publicAPI) EditUserInfo(ctx context.Context, request api.EditUserInfoRequestObject) (api.EditUserInfoResponseObject, error) {
	err := p.userService.EditUserInfo(ctx, request.Body.FirstName, request.Body.LastName, request.Body.AvatarPath)
	if err != nil {
		return nil, err
	}

	return api.EditUserInfo200Response{}, nil
}

func (p *publicAPI) GetUserData(ctx context.Context, request api.GetUserDataRequestObject) (api.GetUserDataResponseObject, error) {
	id, err := utils.GetUserID(ctx)
	if err != nil {
		return nil, err
	}

	userData, err := p.userQueryService.GetUserData(ctx, id)
	if err != nil {
		return nil, err
	}

	return api.GetUserData200JSONResponse{
		Data: api.UserData{
			Id:         userData.ID,
			FirstName:  userData.FirstName,
			LastName:   userData.LastName,
			AvatarPath: userData.AvatarPath,
		},
	}, nil
}

func (p *publicAPI) DeleteUser(ctx context.Context, request api.DeleteUserRequestObject) (api.DeleteUserResponseObject, error) {
	err := p.userService.DeleteUser(ctx, request.UserID)
	if err != nil {
		return nil, err
	}

	return api.DeleteUser200Response{}, nil
}

func (p *publicAPI) LoginUser(ctx context.Context, request api.LoginUserRequestObject) (api.LoginUserResponseObject, error) {
	id, err := p.userService.ValidateUser(request.Body.Login, request.Body.Password)
	if err != nil {
		return nil, err
	}

	token, err := auth.GenerateJWT(id)
	if err != nil {
		return nil, err
	}

	return api.LoginUser200JSONResponse{Token: token}, nil
}

func (p *publicAPI) RegisterUser(ctx context.Context, request api.RegisterUserRequestObject) (api.RegisterUserResponseObject, error) {
	err := p.userService.CreateUser(service.CreateData{
		FirstName: request.Body.FirstName,
		LastName:  request.Body.LastName,
		Email:     request.Body.Email,
		Password:  request.Body.Password,
	})
	if err != nil {
		return nil, err
	}

	return api.RegisterUser200Response{}, nil
}

func (p *publicAPI) GetAuthorizedUser(ctx context.Context, request api.GetAuthorizedUserRequestObject) (api.GetAuthorizedUserResponseObject, error) {
	id, err := utils.GetUserID(ctx)
	if err != nil {
		return nil, err
	}

	userInfo, err := p.userQueryService.GetUserInfo(ctx, id)
	if err != nil {
		return nil, err
	}

	apiUserInfo, err := toAPIUserInfo(userInfo)
	if err != nil {
		return nil, err
	}
	return api.GetAuthorizedUser200JSONResponse{
		User: apiUserInfo,
	}, nil
}

func (p *publicAPI) ListUsers(ctx context.Context, request api.ListUsersRequestObject) (api.ListUsersResponseObject, error) {
	userInfos, err := p.userQueryService.ListUserInfo(ctx)
	if err != nil {
		return nil, err
	}

	apiUsers := make([]api.UserInfo, 0, len(userInfos))
	for _, userInfo := range userInfos {
		apiUser, err2 := toAPIUserInfo(userInfo)
		if err2 != nil {
			return nil, err2
		}
		apiUsers = append(apiUsers, apiUser)
	}

	return api.ListUsers200JSONResponse{
		Users: apiUsers,
	}, nil
}

func (p *publicAPI) GetUserInfo(ctx context.Context, request api.GetUserInfoRequestObject) (api.GetUserInfoResponseObject, error) {
	userInfo, err := p.userQueryService.GetUserInfo(ctx, request.UserID)
	if err != nil {
		return nil, err
	}

	apiUserInfo, err := toAPIUserInfo(userInfo)
	if err != nil {
		return nil, err
	}
	return api.GetUserInfo200JSONResponse{
		User: apiUserInfo,
	}, nil
}

func (p *publicAPI) ChangeUserRole(ctx context.Context, request api.ChangeUserRoleRequestObject) (api.ChangeUserRoleResponseObject, error) {
	role, err := toRole(request.Body.Role)
	if err != nil {
		return nil, err
	}

	err = p.userService.ChangeRole(ctx, request.UserID, role)
	if err != nil {
		return nil, err
	}

	return api.ChangeUserRole200Response{}, nil
}

func (p *publicAPI) UploadFile(ctx context.Context, request api.UploadFileRequestObject) (api.UploadFileResponseObject, error) {
	if request.Body == nil {
		return nil, ErrInvalidUploadContentData
	}

	part, err := request.Body.NextRawPart()
	if err != nil {
		return nil, ErrInvalidUploadContentData
	}
	contentType := part.Header.Get("Content-Type")
	defer part.Close()

	path, err := p.fileService.UploadFile(contentType, part)
	if err != nil {
		return nil, err
	}

	return api.UploadFile200JSONResponse{
		FilePath: path,
	}, nil
}

func (p *publicAPI) GetFile(ctx context.Context, request api.GetFileRequestObject) (api.GetFileResponseObject, error) {
	//TODO implement me
	panic("implement me")
}

func toAPIRole(role model.UserRole) (api.UserInfoRole, error) {
	switch role {
	case model.DefaultUser:
		return api.UserInfoRoleUser, nil
	case model.Editor:
		return api.UserInfoRoleEditor, nil
	case model.Admin:
		return api.UserInfoRoleAdmin, nil
	default:
		return api.UserInfoRoleUser, errors.New(ErrInvalidRole.Error())
	}
}

func toRole(role api.ChangeUserRoleRequestRole) (model.UserRole, error) {
	switch role {
	case api.ChangeUserRoleRequestRoleUser:
		return model.DefaultUser, nil
	case api.ChangeUserRoleRequestRoleEditor:
		return model.Editor, nil
	default:
		return model.DefaultUser, errors.New(ErrInvalidRole.Error())
	}
}

func toReadingStatus(status api.ChangeReadingStatusRequestReadingStatus) (appmodel.ReadingStatus, error) {
	switch status {
	case api.ChangeReadingStatusRequestReadingStatusInProgress:
		return appmodel.InProgress, nil
	case api.ChangeReadingStatusRequestReadingStatusFinished:
		return appmodel.Finished, nil
	case api.ChangeReadingStatusRequestReadingStatusPlanned:
		return appmodel.Planned, nil
	default:
		return appmodel.Planned, errors.New(ErrInvalidReadingStatus.Error())
	}
}

func toBookInLibReadingStatus(status appmodel.ReadingStatus) api.BookInLibraryReadingStatus {
	switch status {
	case appmodel.InProgress:
		return api.InProgress
	case appmodel.Finished:
		return api.Finished
	case appmodel.Planned:
		return api.Planned
	}

	return api.InProgress
}

func toAPIUserInfo(userInfo query.UserInfo) (api.UserInfo, error) {
	apiRole, err := toAPIRole(userInfo.Role)
	if err != nil {
		return api.UserInfo{}, err
	}

	return api.UserInfo{
		Id:         userInfo.ID,
		FirstName:  userInfo.FirstName,
		LastName:   userInfo.LastName,
		Email:      userInfo.Email,
		Role:       &apiRole,
		AvatarPath: userInfo.AvatarPath,
	}, nil
}

func toAPIAuthorInfo(authorInfo query.AuthorInfo) api.AuthorInfo {
	return api.AuthorInfo{
		Id:          authorInfo.ID,
		FirstName:   authorInfo.FirstName,
		LastName:    authorInfo.LastName,
		Description: authorInfo.Description,
		AvatarPath:  authorInfo.AvatarPath,
	}
}

func toAPIArticleInfoStatus(status model.ArticleStatus) api.ArticleInfoStatus {
	switch status {
	case model.Unpublished:
		return api.ArticleInfoStatusUnpublished
	case model.Published:
		return api.ArticleInfoStatusPublished
	}

	return api.ArticleInfoStatusUnpublished
}

func toAPIArticleDataStatus(status model.ArticleStatus) api.ArticleDataStatus {
	switch status {
	case model.Unpublished:
		return api.ArticleDataStatusUnpublished
	case model.Published:
		return api.ArticleDataStatusPublished
	}

	return api.ArticleDataStatusUnpublished
}
