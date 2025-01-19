package transport

import (
	"booklib/api"
	"booklib/pkg/app/query"
	"booklib/pkg/app/service"
	"booklib/pkg/domain/model"
	"context"
	"errors"
	"net/http"
)

// nolint:gocyclo
func NewPublicAPIErrorsMiddleware() api.StrictMiddlewareFunc {
	return func(f api.StrictHandlerFunc, _ string) api.StrictHandlerFunc {
		return func(ctx context.Context, w http.ResponseWriter, r *http.Request, args interface{}) (interface{}, error) {
			resp, err := f(ctx, w, r, args)
			if err != nil {
				if errors.Is(err, query.ErrUserNotFound) ||
					errors.Is(err, model.ErrAuthorNotFound) {
					return api.NotFoundJSONResponse{
						Code:    api.NotFoundResponseDataCodeNotFound,
						Message: err.Error(),
					}, nil
				} else if errors.Is(err, ErrInvalidRole) ||
					errors.Is(err, model.ErrUserAlreadyExist) {
					return api.BadRequestJSONResponse{
						Code:    api.BadRequestResponseDataCodeBadRequest,
						Message: err.Error(),
					}, nil
				} else if errors.Is(err, service.ErrPermissionDenied) {
					return api.PermissionDeniedJSONResponse{
						Code:    api.PermissionDeniedResponseDataCodePermissionDenied,
						Message: err.Error(),
					}, nil
				}
			}
			return resp, nil
		}
	}
}
