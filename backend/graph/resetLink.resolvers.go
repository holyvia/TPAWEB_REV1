package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"github.com/google/uuid"
	"github.com/holyvia/gqlgen-todos/graph/model"
	"github.com/holyvia/gqlgen-todos/service"
)

// CreateResetLink is the resolver for the createResetLink field.
func (r *mutationResolver) CreateResetLink(ctx context.Context, userEmail string) (string, error) {
	id := uuid.NewString()

	user, err := service.GetUserByEmail(ctx, userEmail)

	validationCode, err := service.GenerateValidation(ctx)
	if err != nil {
		return "Error", err
	}
	link := &model.ResetLink{
		ID:             id,
		UserID:         user.ID,
		Link:           "http://localhost:5173/validationcode/" + id,
		ValidationCode: validationCode,
	}

	if err := r.DB.Create(link).Error; err != nil {
		return "Error", err
	}

	service.SendResetPassword(user.Email, link.Link, link.ValidationCode)
	return "Success", nil
}

// GetResetLink is the resolver for the getResetLink field.
func (r *queryResolver) GetResetLink(ctx context.Context, id string) (*model.ResetLink, error) {
	return service.GetResetLinkFunc(ctx, id)
}
