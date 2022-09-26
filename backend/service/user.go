package service

import (
	"context"
	"math/rand"
	"strconv"
	"strings"

	"sort"

	"github.com/google/uuid"
	"github.com/holyvia/gqlgen-todos/config"
	"github.com/holyvia/gqlgen-todos/graph/model"
	"github.com/holyvia/gqlgen-todos/tools"
)

func CreateUser(ctx context.Context, newUser model.NewUser) (*model.User, error) {
	db := database.GetDB()
	newUser.Password = tools.HashPassword(newUser.Password)
	var emptyArrString []string
	user := model.User{
		ID:             uuid.NewString(),
		Name:           newUser.Name,
		Email:          strings.ToLower(newUser.Email),
		Password:       newUser.Password,
		Validate:      	false,
		PhotoProfile:   "",
		RequestConnect: emptyArrString,
		FollowedUser:   emptyArrString,
		ConnectedUser:  emptyArrString,
	}
	if err := db.Model(user).Create(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func CreateUserNoValidate(ctx context.Context,id string, newUser model.NewUser) (*model.User, error) {
	db := database.GetDB()
	newUser.Password = tools.HashPassword(newUser.Password)
	var emptyArrString []string
	user := model.User{
		ID:             id,
		Name:           newUser.Name,
		Email:          strings.ToLower(newUser.Email),
		Password:       newUser.Password,
		Validate:       true,
		PhotoProfile:   "",
		RequestConnect: emptyArrString,
		FollowedUser:   emptyArrString,
		ConnectedUser:  emptyArrString,
	}
	if err := db.Model(user).Create(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func UserGetByID(ctx context.Context, id string) (*model.User, error) {
	db := database.GetDB()
	var user model.User
	if err := db.Model(user).Where("id = ?", id).Take(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func GetUserByEmail(ctx context.Context, email string) (*model.User, error) {
	db := database.GetDB()
	var user model.User
	err := db.Model(user).Where("email LIKE ?", email).Take(&user).Error
	if err != nil {
		return nil, err
	}
	return &user, err
}

func UpdateUser(ctx context.Context, id string, name string, work string, education string, region string, profileURL string, backgroundURL string) (interface{}, error) {
	model := new(model.User)
	db := database.GetDB()
	err := db.First(model, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	token, err := JwtGenerate(ctx, id)
	if err != nil {
		return nil, err
	}
	model.Name = name
	model.Work = work
	model.Education = education
	model.Region = region
	model.PhotoProfile = profileURL
	model.BackgroundPhoto = backgroundURL

	return map[string]interface{}{
		"id":               model.ID,
		"name":             model.Name,
		"email":            model.Email,
		"validate":         model.Validate,
		"work":             model.Work,
		"education":        model.Education,
		"region":           model.Region,
		"photo_profile":    model.PhotoProfile,
		"photo_background": model.BackgroundPhoto,
		"request_connect":  model.RequestConnect,
		"followed_user":    model.FollowedUser,
		"connected_user":   model.ConnectedUser,
		"token":            token,
	}, db.Where("id = ?", id).Save(model).Error
}

// func UpdatePassword(ctx context.Context,id string, newPassword string) (string,error){

// }

func ActivateUser(ctx context.Context, id string) (interface{}, error) {
	model := new(model.User)
	db := database.GetDB()
	err := db.First(model, "id = ?", id).Error
	if err != nil {
		return nil, err
	}
	isActive := model.Validate
	if !isActive {
		model.Validate = true
	}
	return model, db.Where("id = ?", id).Save(model).Error

}

func ResetPassword(idLink string , newPass string) (interface{}, error){
	db := database.GetDB()
	link :=new(model.ResetLink)
	err:= db.Find(&link, "id = ?", idLink).Error
	if err!=nil{
		return nil, err
	}
	newPassword:= tools.HashPassword(newPass)
	modelLink := new(model.User)
	err = db.Find(&modelLink, "id = ?", link.UserID).Error
	if err != nil {
		return nil, err
	}
	modelLink.Password = newPassword
	return modelLink, db.Where("id = ?", modelLink.ID).Save(modelLink).Error
}

func GetUsersByName(ctx context.Context, name string, limit int, offset int) ([]*model.User, error) {
	db := database.GetDB()
	if name == "" {
		name = "%"
	}

	var users []*model.User
	if err := db.Limit(limit).Offset(offset).Find(&users, "LOWER(name) like ?", "%"+strings.ToLower(name)+"%").Error; err != nil {
		return nil, err
	}
	return users, nil
}

func RemoveElementFromArray(model []string, toSearch string) []string {
	index := sort.StringSlice(model).Search(toSearch)
	model[index] = model[len(model)-1]
	model[len(model)-1] = ""
	model = model[:len(model)-1]
	return model
}

func FollowUser(ctx context.Context, id string, followedId string) (interface{}, error) {
	db := database.GetDB()
	model, err := UserGetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	model.FollowedUser = append(model.FollowedUser, followedId)
	return model, db.Where("id = ?", id).Save(model).Error
}

func UnfollowUser(ctx context.Context, id string, unfollowedId string) (interface{}, error) {
	db := database.GetDB()
	model, err := UserGetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	model.FollowedUser = RemoveElementFromArray(model.FollowedUser, unfollowedId)
	return model, db.Where("id = ?", id).Save(model).Error
}

func SendConnectRequest(ctx context.Context, id string, requestedId string) (interface{}, error) {
	db := database.GetDB()
	userRequested, err := UserGetByID(ctx, requestedId)
	if err != nil {
		return nil, err
	}
	userRequested.RequestConnect = append(userRequested.RequestConnect, id)
	userNow, err := UserGetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	userNow.PendingRequest = append(userNow.PendingRequest, requestedId)
	db.Where("id = ?", userNow.ID).Save(userNow)
	return map[string]interface{}{
		"userNow":       userNow,
		"userRequested": userRequested,
	}, db.Save(userRequested).Error
}

func AcceptConnectRequest(ctx context.Context, id string, acceptedId string) (interface{}, error) {
	db := database.GetDB()
	if userNow, err := UserGetByID(ctx, id); err != nil {
		return nil, err
	} else {
		userNow.RequestConnect = RemoveElementFromArray(userNow.RequestConnect, acceptedId)
		userNow.ConnectedUser = append(userNow.ConnectedUser, acceptedId)
		if err := db.Where("id = ?", id).Save(userNow).Error; err != nil {
			return nil, err
		} else {
			db.Where("id = ?", id).Save(userNow)
		}
	}
	if userWillAccept, err := UserGetByID(ctx, acceptedId); err != nil {
		return nil, err
	} else {
		userWillAccept.PendingRequest = RemoveElementFromArray(userWillAccept.PendingRequest, id)
		userWillAccept.ConnectedUser = append(userWillAccept.ConnectedUser, id)
		if err := db.Where("id = ?", acceptedId).Save(userWillAccept).Error; err != nil {
			return nil, err
		} else {
			db.Where("id = ?", acceptedId).Save(userWillAccept)
		}
	}
	user, err := UserGetByID(ctx, id)
	return user, err
}

func IgnoreConnectRequest(ctx context.Context, id string, ignoredId string) (interface{}, error) {
	db := database.GetDB()
	if userNow, err := UserGetByID(ctx, id); err != nil {
		return nil, err
	} else {
		userNow.RequestConnect = RemoveElementFromArray(userNow.RequestConnect, ignoredId)
		if err := db.Where("id = ?", id).Save(userNow).Error; err != nil {
			return nil, err
		} else {
			db.Where("id = ?", id).Save(userNow)
		}
	}
	if userWillAccept, err := UserGetByID(ctx, ignoredId); err != nil {
		return nil, err
	} else {
		userWillAccept.PendingRequest = RemoveElementFromArray(userWillAccept.PendingRequest, id)
		if err := db.Where("id = ?", ignoredId).Save(userWillAccept).Error; err != nil {
			return nil, err
		} else {
			db.Where("id = ?", ignoredId).Save(userWillAccept)
		}
	}
	user, err := UserGetByID(ctx, id)
	return user, err
}

func UnconnectUser(ctx context.Context, id string, unconnectedId string) (interface{}, error) {
	db := database.GetDB()
	if userNow, err := UserGetByID(ctx, id); err != nil {
		return nil, err
	} else {
		userNow.ConnectedUser = RemoveElementFromArray(userNow.ConnectedUser, unconnectedId)
		if err := db.Where("id = ?", id).Save(userNow).Error; err != nil {
			return nil, err
		} else {
			db.Where("id = ?", id).Save(userNow)
		}
	}
	if userWillUnconnect, err := UserGetByID(ctx, unconnectedId); err != nil {
		return nil, err
	} else {
		userWillUnconnect.ConnectedUser = RemoveElementFromArray(userWillUnconnect.ConnectedUser, id)
		if err := db.Where("id = ?", unconnectedId).Save(userWillUnconnect).Error; err != nil {
			return nil, err
		} else {
			db.Where("id = ?", unconnectedId).Save(userWillUnconnect)
		}
	}
	user, err := UserGetByID(ctx, id)
	return user, err
}

func RemoveRequest(ctx context.Context, id string, removedId string) (interface{}, error){
	db:=database.GetDB()
	if userNow, err := UserGetByID(ctx, id); err != nil {
		return nil, err
	} else {
		userNow.PendingRequest = RemoveElementFromArray(userNow.PendingRequest, removedId)
		if err := db.Where("id = ?", id).Save(userNow).Error; err != nil {
			return nil, err
		} else {
			db.Where("id = ?", id).Save(userNow)
		}
	}
	if userWillRemoved, err := UserGetByID(ctx, removedId); err != nil {
		return nil, err
	} else {
		userWillRemoved.RequestConnect = RemoveElementFromArray(userWillRemoved.RequestConnect, id)
		if err := db.Where("id = ?", removedId).Save(userWillRemoved).Error; err != nil {
			return nil, err
		} else {
			db.Where("id = ?", removedId).Save(userWillRemoved)
		}
	}
	user, err := UserGetByID(ctx, id)
	return user, err
}

func contains(s []*model.User, str *model.User) bool {
	for _, v := range s {
		if v.ID == str.ID {
			return true
		}
	}

	return false
}



func GetUserYouMightKnow(ctx context.Context, id string) (interface{}, error){
	var users []*model.User
	userNow, err := UserGetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	for i := 0; i < len(userNow.ConnectedUser); i++ {
		userFriends, err := UserGetByID(ctx, userNow.ConnectedUser[i])
		if err != nil {
			return nil, err
		}
		for j := 0; j < len(userFriends.ConnectedUser); j++ {
			if userFriends.ConnectedUser[j] != id {
				userFriends, err := UserGetByID(ctx, userFriends.ConnectedUser[j])
				if err != nil {
					return nil, err
				}
				if !contains(users, userFriends){
					users = append(users, userFriends)
				}
		
			}
		}
	}
	return users, nil
}

func GetResetLinkFunc(ctx context.Context, id string)(*model.ResetLink, error){
	db := database.GetDB()
	var resetLink *model.ResetLink
	if err := db.Model(resetLink).Where("id = ?", id).Take(&resetLink).Error; err != nil {
		return nil, err
	}
	return resetLink, nil
}

func GenerateValidation(ctx context.Context)(string, error){
	code := "";
	code = code + strconv.Itoa(rand.Intn(10))
	code = code + strconv.Itoa(rand.Intn(10))
	code = code + strconv.Itoa(rand.Intn(10))
	code = code + strconv.Itoa(rand.Intn(10))
	return code, nil
}

func GetConnectedUsersByName(ctx context.Context, id string, name string, limit int, offset int) ([]*model.User, error) {
	db := database.GetDB()
	if name == "" {
		name = "%"
	}

	var users []*model.User
	if err := db.Limit(limit).Offset(offset).Find(&users, "LOWER(name) like ?", "%"+strings.ToLower(name)+"%").Error; err != nil {
		return nil, err
	}

	var connected_user []*model.User

	user, err := UserGetByID(ctx, id)

	for i := 0; i < len(users); i++{
		for j:=0 ;j<len(user.ConnectedUser); j++{
			if users[i].ID == user.ConnectedUser[j]{
				connected_user = append(connected_user, users[i])
			}
		}
	}
	
	return connected_user, err
}

func ViewUserFunc(ctx context.Context, id string, viewedID string) (interface{}, error){
	db := database.GetDB()
	if userViewed, err := UserGetByID(ctx, viewedID); err!=nil{
		return nil, err
	}else{
		for i := 0; i < len(userViewed.ViewProfile); i++{
			if(userViewed.ViewProfile[i] == id){
				return nil, err
			}
		}
		userViewed.ViewProfile = append(userViewed.ViewProfile, id)
	
		return userViewed, db.Where("id = ?", viewedID).Save(userViewed).Error
	}

}

func BlockUser(ctx context.Context, id string, blockedId string) (interface{}, error) {
	db := database.GetDB()
	model, err := UserGetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	model.BlockedUser = append(model.BlockedUser, blockedId)
	return model, db.Where("id = ?", id).Save(model).Error
}

func UnblockUser(ctx context.Context, id string, unblockedId string) (interface{}, error) {
	db := database.GetDB()
	model, err := UserGetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	model.BlockedUser = RemoveElementFromArray(model.BlockedUser, unblockedId)
	return model, db.Where("id = ?", id).Save(model).Error
}
