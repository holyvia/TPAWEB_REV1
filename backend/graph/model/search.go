package model

type Search struct{
	Users []*User `json:"users"`
	Posts []*Post `json:"posts"`
}

type Searchpost struct{
	Posts []*Post `json:"posts"`
}