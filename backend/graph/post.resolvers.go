package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"sort"
	"time"

	"github.com/google/uuid"
	database "github.com/holyvia/gqlgen-todos/config"
	"github.com/holyvia/gqlgen-todos/graph/model"
	"github.com/holyvia/gqlgen-todos/service"
)

// CreatePost is the resolver for the createPost field.
func (r *mutationResolver) CreatePost(ctx context.Context, id string, userID string, caption string, photoURL *string, videoURL *string) (interface{}, error) {
	var emptyArrString []string
	post := model.Post{
		ID:        id,
		UserID:    userID,
		Caption:   caption,
		PhotoURL:  *photoURL,
		VideoURL:  *videoURL,
		Likes:     emptyArrString,
		Comments:  emptyArrString,
		Sends:     emptyArrString,
		CreatedAt: time.Now(),
	}
	err := r.DB.Create(&post).Error
	if err != nil {
		return nil, err
	}
	return post, nil
}

// LikePost is the resolver for the likePost field.
func (r *mutationResolver) LikePost(ctx context.Context, id string, likerID string) (interface{}, error) {
	model, err := service.GetPostByID(ctx, id)
	if err != nil {
		return nil, err
	}
	model.Likes = append(model.Likes, likerID)

	return model, r.DB.Where("id = ?", id).Save(model).Error
}

// UnlikePost is the resolver for the unlikePost field.
func (r *mutationResolver) UnlikePost(ctx context.Context, id string, unlikerID string) (interface{}, error) {
	model, err := service.GetPostByID(ctx, id)
	if err != nil {
		return nil, err
	}
	model.Likes = service.RemoveElementFromArray(model.Likes, unlikerID)
	return model, r.DB.Where("id = ?", id).Save(model).Error
}

// CommentPost is the resolver for the commentPost field.
func (r *mutationResolver) CommentPost(ctx context.Context, postID string, commenterID string, comment string) (interface{}, error) {
	var emptyArrString []string
	commentID := uuid.NewString()
	model := &model.Comment{
		ID:               commentID,
		UserID:           commenterID,
		Comment:          comment,
		Likes:            emptyArrString,
		Reply:            emptyArrString,
		CreatedAt:        time.Now(),
		ReplyToCommentID: "",
	}
	if err := r.DB.Model(model).Create(&model).Error; err != nil {
		return nil, err
	}

	post, err := service.GetPostByID(ctx, postID)
	if err != nil {
		return nil, err
	}
	post.Comments = append(post.Comments, commentID)
	return post, r.DB.Where("id = ?", postID).Save(post).Error
}

// LikeComment is the resolver for the likeComment field.
func (r *mutationResolver) LikeComment(ctx context.Context, commentID string, likerID string) (interface{}, error) {
	model, err := service.GetCommentByID(ctx, commentID)
	if err != nil {
		return nil, err
	}
	model.Likes = append(model.Likes, likerID)

	return model, r.DB.Where("id = ?", commentID).Save(model).Error
}

// UnlikeComment is the resolver for the unlikeComment field.
func (r *mutationResolver) UnlikeComment(ctx context.Context, commentID string, unlikerID string) (interface{}, error) {
	model, err := service.GetCommentByID(ctx, commentID)
	if err != nil {
		return nil, err
	}
	model.Likes = service.RemoveElementFromArray(model.Likes, unlikerID)
	return model, r.DB.Where("id = ?", commentID).Save(model).Error
}

// ReplyComment is the resolver for the replyComment field.
func (r *mutationResolver) ReplyComment(ctx context.Context, postID string, commenterID string, comment string, commentID string) (interface{}, error) {
	var emptyArrString []string
	replyID := uuid.NewString()
	model := &model.Comment{
		ID:               replyID,
		UserID:           commenterID,
		Comment:          comment,
		Likes:            emptyArrString,
		Reply:            emptyArrString,
		CreatedAt:        time.Now(),
		ReplyToCommentID: commentID,
	}
	if err := r.DB.Model(model).Create(&model).Error; err != nil {
		return nil, err
	}

	post, err := service.GetPostByID(ctx, postID)
	if err != nil {
		return nil, err
	}
	post.Comments = append(post.Comments, replyID)
	return post, r.DB.Where("id = ?", postID).Save(post).Error
}

// AddSends is the resolver for the addSends field.
func (r *mutationResolver) AddSends(ctx context.Context, postID string) (interface{}, error) {
	post, err := service.GetPostByID(ctx, postID)
	if err != nil {
		return nil, err
	}
	sendNumbers := post.Sends
	post.Sends = sendNumbers

	return post, r.DB.Where("id = ?", postID).Save(post).Error
}

// GenerateID is the resolver for the generateID field.
func (r *queryResolver) GenerateID(ctx context.Context) (interface{}, error) {
	id := uuid.NewString()
	return id, nil
}

// GetPosts is the resolver for the getPosts field.
func (r *queryResolver) GetPosts(ctx context.Context, id string, limit int, offset int) (interface{}, error) {
	db := database.GetDB()

	var selfPosts []*model.Post
	if err := db.Limit(limit).Offset(offset).Find(&selfPosts, "user_id = ?", id).Error; err != nil {
		return nil, err
	}

	userNow, err := service.UserGetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	var connectedPosts []*model.Post
	var alreadyConnect []string
	for i := 0; i < len(userNow.ConnectedUser); i++ {
		alreadyConnect = append(alreadyConnect, userNow.ConnectedUser[i])
		if err := db.Limit(limit).Offset(offset).Find(&connectedPosts, "user_id = ?", userNow.ConnectedUser[i]).Error; err != nil {
			return nil, err
		}
	}
	var followedPosts []*model.Post
	for j := 0; j < len(userNow.FollowedUser); j++ {
		if alreadyConnect[j] != userNow.FollowedUser[j] {
			if err := db.Limit(limit).Offset(offset).Find(&followedPosts, "user_id = ?", userNow.FollowedUser[j]).Error; err != nil {
				return nil, err
			}
		}
	}
	var posts []*model.Post
	posts = append(posts, selfPosts...)
	posts = append(posts, connectedPosts...)
	posts = append(posts, followedPosts...)

	sort.SliceStable(posts, func(i, j int) bool {
		return posts[i].CreatedAt.Unix() > posts[j].CreatedAt.Unix()
	})

	return posts, nil
}

// GetComment is the resolver for the getComment field.
func (r *queryResolver) GetComment(ctx context.Context, postID string) (interface{}, error) {
	post, err := service.GetPostByID(ctx, postID)
	if err != nil {
		return nil, err
	}

	var comments []*model.Comment
	for i := 0; i < len(post.Comments); i++ {
		comment, err := service.GetCommentByID(ctx, post.Comments[i])
		if err != nil {
			return nil, err
		}
		comments = append(comments, comment)
	}

	sort.SliceStable(comments, func(i, j int) bool {
		return comments[i].CreatedAt.Unix() > comments[j].CreatedAt.Unix()
	})

	return comments, nil
}

// GetLimitComment is the resolver for the getLimitComment field.
func (r *queryResolver) GetLimitComment(ctx context.Context, postID string) (interface{}, error) {
	post, err := service.GetPostByID(ctx, postID)
	if err != nil {
		return nil, err
	}

	var comments []*model.Comment
	if len(post.Comments) < 3 {
		for i := 0; i < len(post.Comments); i++ {
			comment, err := service.GetCommentByID(ctx, post.Comments[i])
			if err != nil {
				return nil, err
			}
			comments = append(comments, comment)
		}
		sort.SliceStable(comments, func(i, j int) bool {
			return comments[i].CreatedAt.Unix() > comments[j].CreatedAt.Unix()
		})
		return comments, nil
	}

	for i := 0; i < 3; i++ {
		comment, err := service.GetCommentByID(ctx, post.Comments[i])
		if err != nil {
			return nil, err
		}
		comments = append(comments, comment)
	}
	sort.SliceStable(comments, func(i, j int) bool {
		return comments[i].CreatedAt.Unix() > comments[j].CreatedAt.Unix()
	})

	return comments, nil
}

// GetReply is the resolver for the getReply field.
func (r *queryResolver) GetReply(ctx context.Context, commentID string) (interface{}, error) {
	replies, err := service.GetReplies(ctx, commentID)
	return replies, err
}

// GetPost is the resolver for the getPost field.
func (r *queryResolver) GetPost(ctx context.Context, id string) (interface{}, error) {
	db := database.GetDB()
	var post model.Post
	if err := db.Model(post).Where("id = ?", id).Take(&post).Error; err != nil {
		return nil, err
	}
	return &post, nil
}
