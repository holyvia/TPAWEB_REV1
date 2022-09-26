package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"sort"
	"time"

	database "github.com/holyvia/gqlgen-todos/config"
	"github.com/holyvia/gqlgen-todos/graph/model"
)

// CreateJobs is the resolver for the createJobs field.
func (r *mutationResolver) CreateJobs(ctx context.Context, id string, userID string, title string, company string, position string, description string) (interface{}, error) {
	job := model.Job{
		ID:          id,
		UserID:      userID,
		Title:       title,
		Company:     company,
		Position:    position,
		Description: description,
		CreatedAt:   time.Now(),
	}
	err := r.DB.Create(&job).Error
	if err != nil {
		return nil, err
	}
	return job, nil
}

// GetJobs is the resolver for the getJobs field.
func (r *queryResolver) GetJobs(ctx context.Context, limit int, offset int) (interface{}, error) {
	db := database.GetDB()

	var jobs []*model.Job
	if err := db.Limit(limit).Offset(offset).Find(&jobs).Error; err != nil {
		return nil, err
	}

	sort.SliceStable(jobs, func(i, j int) bool {
		return jobs[i].CreatedAt.Unix() > jobs[j].CreatedAt.Unix()
	})

	return jobs, nil
}
