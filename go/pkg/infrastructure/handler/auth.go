package handler

import (
	"homepage/pkg/configs"
	"homepage/pkg/infrastructure/server/response"
	"net/http"
)

type AuthHandler interface {
	Login(w http.ResponseWriter, r *http.Request)
	// Logout() http.HandlerFunc
}

type authHandler struct {
}

func NewAuthHandler() AuthHandler {
	return &authHandler{}
}

func (ah *authHandler) Login(w http.ResponseWriter, r *http.Request) {
	info := createInfo(r, "login")
	var body interface{}

	studentID := r.PostFormValue("studentID")
	password := r.PostFormValue("password")

	if studentID == "" || password == "" {
		response.Success(w, "login.html", info, body)
		return
	}

	// TODO: getData

	// TODO: verify

	// TODO: redirect
	cookie := &http.Cookie{
		Name:  configs.CookieName,
		Value: studentID,
	}
	http.SetCookie(w, cookie)
	response.Success(w, "login.html", info, body)
}

// func (ah *authHandler) Logout() http.HandlerFunc {

// }
