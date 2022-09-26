package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	database "github.com/holyvia/gqlgen-todos/config"
	"github.com/holyvia/gqlgen-todos/graph/model"
)

// AddExperience is the resolver for the addExperience field.
func (r *mutationResolver) AddExperience(ctx context.Context, id string, userID string, company string, position string, description string, image string, monthStart int, yearStart int, monthEnd int, yearEnd int) (interface{}, error) {
	experience := model.Experience{
		ID:          id,
		UserID:      userID,
		Company:     company,
		Position:    position,
		Description: description,
		Image:       image,
		MonthStart:  monthStart,
		YearStart:   yearStart,
		MonthEnd:    monthEnd,
		YearEnd:     yearEnd,
	}
	err := r.DB.Create(&experience).Error
	if err != nil {
		return nil, err
	}
	model := new(model.User)
	db := database.GetDB()
	err = db.First(model, "id = ?", userID).Error
	if err != nil {
		return nil, err
	}

	model.Work = company

	err = db.Where("id = ?", userID).Save(model).Error
	if err != nil {
		return nil, err
	}

	return experience, nil
}

// UpdateExperience is the resolver for the updateExperience field.
func (r *mutationResolver) UpdateExperience(ctx context.Context, id string, userID string, company string, position string, description string, image string, monthStart int, yearStart int, monthEnd int, yearEnd int) (interface{}, error) {
	experience := new(model.Experience)
	db := database.GetDB()
	err := db.First(experience, "id = ?", id).Error
	if err != nil {
		return nil, err
	}

	experience.Company = company
	experience.Description = description
	experience.Position = position
	experience.Image = image
	experience.MonthEnd = monthEnd
	experience.MonthStart = monthStart
	experience.YearEnd = yearEnd
	experience.YearStart = yearStart

	model := new(model.User)

	err = db.First(model, "id = ?", userID).Error
	if err != nil {
		return nil, err
	}

	model.Work = company

	err = db.Where("id = ?", userID).Save(model).Error
	if err != nil {
		return nil, err
	}
	return map[string]interface{}{
		"id":       experience.ID,
		"company":  experience.Company,
		"position": experience.Position,
	}, db.Where("id = ?", id).Save(experience).Error
}

// DeleteExperience is the resolver for the deleteExperience field.
func (r *mutationResolver) DeleteExperience(ctx context.Context, id string, userID string) (interface{}, error) {
	db := database.GetDB()
	db.Table("experiences").Where("id = ?", id).Delete(&model.Experience{})
	model := new(model.User)
	err := db.First(model, "id = ?", userID).Error
	if err != nil {
		return nil, err
	}

	model.Work = ""

	err = db.Where("id = ?", userID).Save(model).Error
	if err != nil {
		return nil, err
	}
	return nil, nil
}

// GetExperience is the resolver for the getExperience field.
func (r *queryResolver) GetExperience(ctx context.Context, userID string) (interface{}, error) {
	db := database.GetDB()

	var allexperiences []*model.Experience
	if err := db.Limit(20).Offset(0).Find(&allexperiences).Error; err != nil {
		return nil, err
	}
	// return allexperiences, nil
	var experiences []*model.Experience
	for i := 0; i < len(allexperiences); i++ {
		if allexperiences[i].UserID == userID {
			// return allexperiences[i],nil
			experiences = append(experiences, allexperiences[i])
		}
	}

	return experiences, nil
}
