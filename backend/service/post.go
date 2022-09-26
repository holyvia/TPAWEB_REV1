package service

import (
	"context"
	"strings"

	database "github.com/holyvia/gqlgen-todos/config"
	"github.com/holyvia/gqlgen-todos/graph/model"
)

func GetPostsByName(ctx context.Context, caption string, limit int, offset int) ([]*model.Post, error) {
	db := database.GetDB()
	if caption == "" {
		caption = "%"
	}

	var posts []*model.Post
	if err := db.Limit(limit).Offset(offset).Find(&posts, "LOWER(caption) like ?", "%"+strings.ToLower(caption)+"%").Error; err != nil {
		return nil, err
	}
	return posts, nil
}

func GetPostByID(ctx context.Context, id string)(*model.Post, error){
	db := database.GetDB()
	var post model.Post
	err := db.Model(post).Where("id = ?", id).Take(&post).Error
	if err != nil {
		return nil, err
	}
	return &post, nil
}

func GetCommentByID(ctx context.Context, id string)(*model.Comment, error){
	db := database.GetDB()
	var comment model.Comment
	err := db.Model(comment).Where("id = ?", id).Take(&comment).Error
	if err != nil {
		return nil, err
	}
	return &comment, nil
}

func GetCommentsFromPost(ctx context.Context, postId string)([]*model.Comment, error){
	post, err := GetPostByID(ctx, postId)
	if err != nil {
		return nil, err
	}
	var comments []*model.Comment
	for i := 0; i < len(post.Comments); i++ {
		comment, err := GetCommentByID(ctx, post.Comments[i])
		if err != nil {
			return nil, err
		}
		comments = append(comments, comment)
	}
	return comments, nil
}

func GetReplies(ctx context.Context, commentID string)([]*model.Comment, error){
	db := database.GetDB()
	var replies []*model.Comment
	if err:= db.Limit(-1).Offset(0).Find(&replies,"reply_to_comment_id like ?",commentID).Error; err != nil {
		return nil, err
	}
	return replies, nil
}

func GetPostByCaption(ctx context.Context, name string, limit int, offset int) ([]*model.Post, error) {
	db := database.GetDB()
	if name == "" {
		name = "%"
	}

	var posts []*model.Post
	if err := db.Limit(limit).Offset(offset).Find(&posts, "LOWER(caption) like ?", "%"+strings.ToLower(name)+"%").Error; err != nil {
		return nil, err
	}
	return posts, nil
}
