package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"github.com/google/uuid"
	"github.com/holyvia/gqlgen-todos/graph/model"
)

// CreateLink is the resolver for the createLink field.
func (r *mutationResolver) CreateLink(ctx context.Context, userID string) (string, error) {
	id := uuid.NewString()
	link := &model.ActivationLink{
		ID:     id,
		UserID: userID,
		Link:   "http://localhost:5173/activate/" + id,
	}

	err := r.DB.Create(link).Error
	if err != nil {
		return "Error", err
	}
	return "Success", nil
}

// GetLink is the resolver for the getLink field.
func (r *queryResolver) GetLink(ctx context.Context, id string) (*model.ActivationLink, error) {
	model := new(model.ActivationLink)
	return model, r.DB.First(model, "id = ?", id).Error
}
