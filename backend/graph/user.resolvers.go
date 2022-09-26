package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"

	"github.com/holyvia/gqlgen-todos/graph/generated"
	"github.com/holyvia/gqlgen-todos/graph/model"
	"github.com/holyvia/gqlgen-todos/service"
)

// Register is the resolver for the register field.
func (r *mutationResolver) Register(ctx context.Context, input model.NewUser) (interface{}, error) {
	return service.UserRegister(ctx, input)
}

// RegisterForGoogle is the resolver for the registerForGoogle field.
func (r *mutationResolver) RegisterForGoogle(ctx context.Context, id string, input model.NewUser) (interface{}, error) {
	return service.UserRegisterNoValidation(ctx, id, input)
}

// Login is the resolver for the login field.
func (r *mutationResolver) Login(ctx context.Context, email string, password string) (interface{}, error) {
	return service.UserLogin(ctx, email, password)
}

// UpdateUser is the resolver for the updateUser field.
func (r *mutationResolver) UpdateUser(ctx context.Context, id string, name string, work string, education string, region string, profileURL string, backgroundURL string) (interface{}, error) {
	return service.UpdateUser(ctx, id, name, work, education, region, profileURL, backgroundURL)
}

// ActivateUser is the resolver for the activateUser field.
func (r *mutationResolver) ActivateUser(ctx context.Context, id string) (interface{}, error) {
	return service.ActivateUser(ctx, id)
}

// UpdatePassword is the resolver for the updatePassword field.
func (r *mutationResolver) UpdatePassword(ctx context.Context, id string, newPassword string) (interface{}, error) {
	return service.ResetPassword(id, newPassword)
}

// Follow is the resolver for the follow field.
func (r *mutationResolver) Follow(ctx context.Context, id string, followedID string) (interface{}, error) {
	return service.FollowUser(ctx, id, followedID)
}

// Unfollow is the resolver for the unfollow field.
func (r *mutationResolver) Unfollow(ctx context.Context, id string, unfollowedID string) (interface{}, error) {
	return service.UnfollowUser(ctx, id, unfollowedID)
}

// SendConnect is the resolver for the sendConnect field.
func (r *mutationResolver) SendConnect(ctx context.Context, id string, requestedID string) (interface{}, error) {
	return service.SendConnectRequest(ctx, id, requestedID)
}

// AcceptConnect is the resolver for the acceptConnect field.
func (r *mutationResolver) AcceptConnect(ctx context.Context, id string, acceptedID string) (interface{}, error) {
	return service.AcceptConnectRequest(ctx, id, acceptedID)
}

// IgnoreConnect is the resolver for the ignoreConnect field.
func (r *mutationResolver) IgnoreConnect(ctx context.Context, id string, ignoredID string) (interface{}, error) {
	return service.IgnoreConnectRequest(ctx, id, ignoredID)
}

// Unconnect is the resolver for the unconnect field.
func (r *mutationResolver) Unconnect(ctx context.Context, id string, unconnectedID string) (interface{}, error) {
	return service.UnconnectUser(ctx, id, unconnectedID)
}

// RemoveRequest is the resolver for the removeRequest field.
func (r *mutationResolver) RemoveRequest(ctx context.Context, id string, removedRequestID string) (interface{}, error) {
	return service.RemoveRequest(ctx, id, removedRequestID)
}

// ViewUser is the resolver for the viewUser field.
func (r *mutationResolver) ViewUser(ctx context.Context, id string, viewedID string) (interface{}, error) {
	return service.ViewUserFunc(ctx, id, viewedID)
}

// BlockUser is the resolver for the blockUser field.
func (r *mutationResolver) BlockUser(ctx context.Context, id string, blockedID string) (interface{}, error) {
	return service.BlockUser(ctx, id, blockedID)
}

// UnblockUser is the resolver for the unblockUser field.
func (r *mutationResolver) UnblockUser(ctx context.Context, id string, unblockedID string) (interface{}, error) {
	return service.UnblockUser(ctx, id, unblockedID)
}

// User is the resolver for the user field.
func (r *queryResolver) User(ctx context.Context, id string) (interface{}, error) {
	return service.UserGetByID(ctx, id)
}

// UserByEmail is the resolver for the userByEmail field.
func (r *queryResolver) UserByEmail(ctx context.Context, email string) (interface{}, error) {
	return service.GetUserByEmail(ctx, email)
}

// Users is the resolver for the users field.
func (r *queryResolver) Users(ctx context.Context) ([]*model.User, error) {
	panic(fmt.Errorf("not implemented"))
}

// Protected is the resolver for the protected field.
func (r *queryResolver) Protected(ctx context.Context) (string, error) {
	panic(fmt.Errorf("not implemented"))
}

// UserYouMightKnow is the resolver for the userYouMightKnow field.
func (r *queryResolver) UserYouMightKnow(ctx context.Context, id string) (interface{}, error) {
	return service.GetUserYouMightKnow(ctx, id)
}

// GetConnectUser is the resolver for the getConnectUser field.
func (r *queryResolver) GetConnectUser(ctx context.Context, id string) (interface{}, error) {
	var users []*model.User
	userNow, err := service.UserGetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	for i := 0; i < len(userNow.ConnectedUser); i++ {
		userFriend, err := service.UserGetByID(ctx, userNow.ConnectedUser[i])
		if err != nil {
			return nil, err
		}
		users = append(users, userFriend)
	}
	return users, nil
}

// GetBlockedUser is the resolver for the getBlockedUser field.
func (r *queryResolver) GetBlockedUser(ctx context.Context, id string) (interface{}, error) {
	panic(fmt.Errorf("not implemented"))
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
