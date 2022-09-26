package tools

import (
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

func HashPassword(s string) string {
	hashed, _ := bcrypt.GenerateFromPassword([]byte(s), bcrypt.DefaultCost)
	return string(hashed)
}

func ComparePassword(hashed string, password string) error {
	fmt.Println(hashed)
	fmt.Println(password)
	return bcrypt.CompareHashAndPassword([]byte(hashed), []byte(password))
}