package service

import (
	"context"
	"errors"

	"github.com/google/uuid"
	database "github.com/holyvia/gqlgen-todos/config"
	"github.com/holyvia/gqlgen-todos/graph/model"
	"github.com/holyvia/gqlgen-todos/tools"
	"github.com/vektah/gqlparser/v2/gqlerror"
	"gorm.io/gorm"
)

func UserRegister(ctx context.Context, newUser model.NewUser) (interface{}, error) {

	_, err := GetUserByEmail(ctx, newUser.Email)

	if err == nil {
		if err != gorm.ErrRecordNotFound {
			return nil, err
		}
	}

	createdUser, err := CreateUser(ctx, newUser)

	if err != nil {
		return nil, err
	}
	token, err := JwtGenerate(ctx, createdUser.ID)
	if err != nil {
		return nil, err
	}

	// verification := &model.UserValidation{
	// 	ID:     uuid.New().String(),
	// 	Link:   uuid.New().String(),
	// 	UserID: createdUser.ID,
	// }

	// db := database.GetDB()
	// err = db.Create(verification).Error

	newId := uuid.NewString()

	verification := &model.ActivationLink{
		ID:     newId,
		Link:   "http://localhost:5173/activate/" + newId,
		UserID: createdUser.ID,
	}

	db := database.GetDB()
	err = db.Create(&verification).Error

	if err != nil {
		return nil, err
	}

	SendEmail(createdUser.Email, verification.Link)

	// mail.SendVerification(verification.Link)

	return map[string]interface{}{
		"token": token,
		"name":  createdUser.Name,
		"email": createdUser.Email,
	}, nil
}

func UserRegisterNoValidation(ctx context.Context,id string, newUser model.NewUser)(interface{}, error) {
	_, err := GetUserByEmail(ctx, newUser.Email)

	if err == nil {
		if err != gorm.ErrRecordNotFound {
			return nil, err
		}
	}

	createdUser, err := CreateUserNoValidate(ctx, id, newUser)

	if err != nil {
		return nil, err
	}
	token, err := JwtGenerate(ctx, createdUser.ID)
	if err != nil {
		return nil, err
	}

	// verification := &model.UserValidation{
	// 	ID:     uuid.New().String(),
	// 	Link:   uuid.New().String(),
	// 	UserID: createdUser.ID,
	// }

	// db := database.GetDB()
	// err = db.Create(verification).Error

	return map[string]interface{}{
		"token": token,
		"name":  createdUser.Name,
		"email": createdUser.Email,
	}, nil
}

func UserLogin(ctx context.Context, email string, password string) (interface{}, error) {
	user, err := GetUserByEmail(ctx, email)
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, &gqlerror.Error{
				Message: "Email Not Found",
			}
		}
		return nil, err
	}

	// if user.Validate == false {
	// 	return nil, errors.New("Your account is not authenticated!")
	// }

	if !user.Validate {
		return nil, errors.New("account is not found")
	}

	if err := tools.ComparePassword(user.Password, password); err != nil {
		return nil, err
	}

	token, err := JwtGenerate(ctx, user.ID)
	if err != nil {
		return nil, err
	}

	return map[string]interface{}{
		"id":               user.ID,
		"name":             user.Name,
		"email":            user.Email,
		"validate":         user.Validate,
		"work":             user.Work,
		"education":        user.Education,
		"region":           user.Region,
		"photo_profile":    user.PhotoProfile,
		"photo_background": user.BackgroundPhoto,
		"request_connect":  user.RequestConnect,
		"followed_user":    user.FollowedUser,
		"connected_user":   user.ConnectedUser,
		"pending_request":  user.PendingRequest,
		"token":            token,
	}, nil
}