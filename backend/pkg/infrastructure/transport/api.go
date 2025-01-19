package transport

import (
	"booklib/api"
	"booklib/pkg/app/query"
	"booklib/pkg/app/service"
	"booklib/pkg/domain/model"
	"booklib/pkg/infrastructure/auth"
	"booklib/pkg/infrastructure/utils"
	"context"
	"errors"
)

var (
	ErrInvalidRole              = errors.New("invalid role")
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
) API {
	return &publicAPI{
		userService:          userService,
		userQueryService:     userQueryService,
		authorService:        authorService,
		authorQueryService:   authorQueryService,
		categoryQueryService: categoryQueryService,
		fileService:          fileService,
	}
}

type publicAPI struct {
	userService          service.UserService
	userQueryService     query.UserQueryService
	authorService        service.AuthorService
	authorQueryService   query.AuthorQueryService
	categoryQueryService query.CategoryQueryService
	fileService          service.FileService
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

func (p *publicAPI) SearchItems(ctx context.Context, request api.SearchItemsRequestObject) (api.SearchItemsResponseObject, error) {
	//TODO implement me
	panic("implement me")
}

func (p *publicAPI) EditUserInfo(ctx context.Context, request api.EditUserInfoRequestObject) (api.EditUserInfoResponseObject, error) {
	err := p.userService.EditUserInfo(ctx, request.Body.FirstName, request.Body.LastName)
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
	//TODO Возможно, что только админ вызывает запрос
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
