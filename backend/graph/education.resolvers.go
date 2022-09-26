package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	database "github.com/holyvia/gqlgen-todos/config"
	"github.com/holyvia/gqlgen-todos/graph/model"
)

// AddEducation is the resolver for the addEducation field.
func (r *mutationResolver) AddEducation(ctx context.Context, id string, userID string, company string, grade string, description string, image string, monthStart int, yearStart int, monthEnd int, yearEnd int) (interface{}, error) {
	education := model.Education{
		ID:          id,
		UserID:      userID,
		Company:     company,
		Grade:       grade,
		Description: description,
		Image:       image,
		MonthStart:  monthStart,
		YearStart:   yearStart,
		MonthEnd:    monthEnd,
		YearEnd:     yearEnd,
	}
	err := r.DB.Create(&education).Error
	if err != nil {
		return nil, err
	}
	model := new(model.User)
	db := database.GetDB()
	err = db.First(model, "id = ?", userID).Error
	if err != nil {
		return nil, err
	}

	model.Education = company

	err = db.Where("id = ?", userID).Save(model).Error
	if err != nil {
		return nil, err
	}
	return education, nil
}

// UpdateEducation is the resolver for the updateEducation field.
func (r *mutationResolver) UpdateEducation(ctx context.Context, id string, userID string, company string, grade string, description string, image string, monthStart int, yearStart int, monthEnd int, yearEnd int) (interface{}, error) {
	education := new(model.Education)
	db := database.GetDB()
	err := db.First(education, "id = ?", id).Error
	if err != nil {
		return nil, err
	}

	education.Company = company
	education.Description = description
	education.Grade = grade
	education.Image = image
	education.MonthEnd = monthEnd
	education.MonthStart = monthStart
	education.YearEnd = yearEnd
	education.YearStart = yearStart

	model := new(model.User)
	err = db.First(model, "id = ?", userID).Error
	if err != nil {
		return nil, err
	}

	model.Education = company

	err = db.Where("id = ?", userID).Save(model).Error
	if err != nil {
		return nil, err
	}
	return map[string]interface{}{
		"id":      education.ID,
		"company": education.Company,
		"grade":   education.Grade,
	}, db.Where("id = ?", id).Save(education).Error
}

// DeleteEducation is the resolver for the deleteEducation field.
func (r *mutationResolver) DeleteEducation(ctx context.Context, id string, userID string) (interface{}, error) {
	db := database.GetDB()
	db.Table("educations").Where("id = ?", id).Delete(&model.Education{})
	model := new(model.User)
	err := db.First(model, "id = ?", userID).Error
	if err != nil {
		return nil, err
	}

	model.Education = ""

	err = db.Where("id = ?", userID).Save(model).Error
	if err != nil {
		return nil, err
	}
	return nil, nil
}

// GetEducation is the resolver for the getEducation field.
func (r *queryResolver) GetEducation(ctx context.Context, userID string) (interface{}, error) {
	db := database.GetDB()

	var alleducations []*model.Education
	if err := db.Limit(20).Offset(0).Find(&alleducations).Error; err != nil {
		return nil, err
	}
	// return alleducations, nil
	var educations []*model.Education
	for i := 0; i < len(alleducations); i++ {
		if alleducations[i].UserID == userID {
			// return alleducations[i],nil
			educations = append(educations, alleducations[i])
		}
	}

	return educations, nil
}
