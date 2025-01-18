package transport

import (
	"booklib/api"
	"context"
)

type API interface {
	api.StrictServerInterface
}

func NewPublicAPI() API {
	return &publicAPI{}
}

type publicAPI struct {
}

func (p *publicAPI) PublishArticle(ctx context.Context, request api.PublishArticleRequestObject) (api.PublishArticleResponseObject, error) {
	//TODO implement me
	panic("implement me")
}

func (p *publicAPI) CreateArticle(ctx context.Context, request api.CreateArticleRequestObject) (api.CreateArticleResponseObject, error) {
	//TODO implement me
	panic("implement me")
}

func (p *publicAPI) ListArticles(ctx context.Context, request api.ListArticlesRequestObject) (api.ListArticlesResponseObject, error) {
	//TODO implement me
	panic("implement me")
}

func (p *publicAPI) ManagementArticles(ctx context.Context, request api.ManagementArticlesRequestObject) (api.ManagementArticlesResponseObject, error) {
	//TODO implement me
	panic("implement me")
}

func (p *publicAPI) GetArticle(ctx context.Context, request api.GetArticleRequestObject) (api.GetArticleResponseObject, error) {
	//TODO implement me
	panic("implement me")
}

func (p *publicAPI) DeleteArticle(ctx context.Context, request api.DeleteArticleRequestObject) (api.DeleteArticleResponseObject, error) {
	//TODO implement me
	panic("implement me")
}

func (p *publicAPI) EditArticle(ctx context.Context, request api.EditArticleRequestObject) (api.EditArticleResponseObject, error) {
	//TODO implement me
	panic("implement me")
}

func (p *publicAPI) CreateAuthor(ctx context.Context, request api.CreateAuthorRequestObject) (api.CreateAuthorResponseObject, error) {
	//TODO implement me
	panic("implement me")
}

func (p *publicAPI) ListAuthors(ctx context.Context, request api.ListAuthorsRequestObject) (api.ListAuthorsResponseObject, error) {
	//TODO implement me
	panic("implement me")
}

func (p *publicAPI) DeleteAuthor(ctx context.Context, request api.DeleteAuthorRequestObject) (api.DeleteAuthorResponseObject, error) {
	//TODO implement me
	panic("implement me")
}

func (p *publicAPI) EditAuthor(ctx context.Context, request api.EditAuthorRequestObject) (api.EditAuthorResponseObject, error) {
	//TODO implement me
	panic("implement me")
}

func (p *publicAPI) GetAuthorInfo(ctx context.Context, request api.GetAuthorInfoRequestObject) (api.GetAuthorInfoResponseObject, error) {
	//TODO implement me
	panic("implement me")
}

func (p *publicAPI) AddBook(ctx context.Context, request api.AddBookRequestObject) (api.AddBookResponseObject, error) {
	//TODO implement me
	panic("implement me")
}

func (p *publicAPI) ListLibraryBooks(ctx context.Context, request api.ListLibraryBooksRequestObject) (api.ListLibraryBooksResponseObject, error) {
	//TODO implement me
	panic("implement me")
}

func (p *publicAPI) GetLibraryStats(ctx context.Context, request api.GetLibraryStatsRequestObject) (api.GetLibraryStatsResponseObject, error) {
	//TODO implement me
	panic("implement me")
}

func (p *publicAPI) ListBooks(ctx context.Context, request api.ListBooksRequestObject) (api.ListBooksResponseObject, error) {
	//TODO implement me
	panic("implement me")
}

func (p *publicAPI) ListAuthorBooks(ctx context.Context, request api.ListAuthorBooksRequestObject) (api.ListAuthorBooksResponseObject, error) {
	//TODO implement me
	panic("implement me")
}

func (p *publicAPI) DeleteBook(ctx context.Context, request api.DeleteBookRequestObject) (api.DeleteBookResponseObject, error) {
	//TODO implement me
	panic("implement me")
}

func (p *publicAPI) EditBook(ctx context.Context, request api.EditBookRequestObject) (api.EditBookResponseObject, error) {
	//TODO implement me
	panic("implement me")
}

func (p *publicAPI) SaveBookFeedback(ctx context.Context, request api.SaveBookFeedbackRequestObject) (api.SaveBookFeedbackResponseObject, error) {
	//TODO implement me
	panic("implement me")
}

func (p *publicAPI) ListBookFeedback(ctx context.Context, request api.ListBookFeedbackRequestObject) (api.ListBookFeedbackResponseObject, error) {
	//TODO implement me
	panic("implement me")
}

func (p *publicAPI) GetBookInfo(ctx context.Context, request api.GetBookInfoRequestObject) (api.GetBookInfoResponseObject, error) {
	//TODO implement me
	panic("implement me")
}

func (p *publicAPI) AddBookToLibrary(ctx context.Context, request api.AddBookToLibraryRequestObject) (api.AddBookToLibraryResponseObject, error) {
	//TODO implement me
	panic("implement me")
}

func (p *publicAPI) RemoveBookFromLibrary(ctx context.Context, request api.RemoveBookFromLibraryRequestObject) (api.RemoveBookFromLibraryResponseObject, error) {
	//TODO implement me
	panic("implement me")
}

func (p *publicAPI) ChangeReadingStatus(ctx context.Context, request api.ChangeReadingStatusRequestObject) (api.ChangeReadingStatusResponseObject, error) {
	//TODO implement me
	panic("implement me")
}

func (p *publicAPI) ListBooksByCategory(ctx context.Context, request api.ListBooksByCategoryRequestObject) (api.ListBooksByCategoryResponseObject, error) {
	//TODO implement me
	panic("implement me")
}

func (p *publicAPI) ListCategories(ctx context.Context, request api.ListCategoriesRequestObject) (api.ListCategoriesResponseObject, error) {
	//TODO implement me
	panic("implement me")
}

func (p *publicAPI) SearchItems(ctx context.Context, request api.SearchItemsRequestObject) (api.SearchItemsResponseObject, error) {
	//TODO implement me
	panic("implement me")
}

func (p *publicAPI) EditUserInfo(ctx context.Context, request api.EditUserInfoRequestObject) (api.EditUserInfoResponseObject, error) {
	//TODO implement me
	panic("implement me")
}

func (p *publicAPI) GetUserData(ctx context.Context, request api.GetUserDataRequestObject) (api.GetUserDataResponseObject, error) {
	//TODO implement me
	panic("implement me")
}

func (p *publicAPI) DeleteUser(ctx context.Context, request api.DeleteUserRequestObject) (api.DeleteUserResponseObject, error) {
	//TODO implement me
	panic("implement me")
}

func (p *publicAPI) LoginUser(ctx context.Context, request api.LoginUserRequestObject) (api.LoginUserResponseObject, error) {
	//TODO implement me
	panic("implement me")
}

func (p *publicAPI) ListUsers(ctx context.Context, request api.ListUsersRequestObject) (api.ListUsersResponseObject, error) {
	//TODO implement me
	panic("implement me")
}

func (p *publicAPI) GetUserInfo(ctx context.Context, request api.GetUserInfoRequestObject) (api.GetUserInfoResponseObject, error) {
	//TODO implement me
	panic("implement me")
}

func (p *publicAPI) ChangeUserRole(ctx context.Context, request api.ChangeUserRoleRequestObject) (api.ChangeUserRoleResponseObject, error) {
	//TODO implement me
	panic("implement me")
}
