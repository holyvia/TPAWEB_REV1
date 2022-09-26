package service

import (
	"fmt"

	"gopkg.in/gomail.v2"
)

func SendEmail(userEmail string, link string) {
	msg := gomail.NewMessage()
	msg.SetHeader("From", "linkHEdin <noreply.linkhedin@gmail.com>")
	msg.SetHeader("To", userEmail)
	msg.SetHeader("Subject", "LinkHEdIn Registration Confirmation")
	msg.SetBody("text/html", fmt.Sprintf("<div>Thanks for registering!</div><div>Please complete your account activation in <a href=%s>here</a></div>", link))

	n := gomail.NewDialer("smtp.gmail.com", 587, "noreply.linkhedin@gmail.com", "olypzmqlrgqapaxs")

	if err := n.DialAndSend(msg); err != nil {
		panic(err)
	}
}

func SendResetPassword(userEmail string, link string, validationCode string) {
	msg := gomail.NewMessage()
	msg.SetHeader("From", "linkHEdin <noreply.linkhedin@gmail.com>")
	msg.SetHeader("To", userEmail)
	msg.SetHeader("Subject", "LinkHEdIn Reset Password")
	msg.SetBody("text/html", fmt.Sprintf("<div> Click <a href=%s>here</a> to reset password. <br>Validation Code: %s</div>", link, validationCode))

	n := gomail.NewDialer("smtp.gmail.com", 587, "noreply.linkhedin@gmail.com", "olypzmqlrgqapaxs")

	if err := n.DialAndSend(msg); err != nil {
		panic(err)
	}
}
