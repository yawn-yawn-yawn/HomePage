package controller

import (
	"errors"
	"homepage/pkg/domain"
	"homepage/pkg/domain/logger"
	"homepage/pkg/usecase/interactor"
)

// AccountController
type AccountController interface {
	ShowAccountByUserID(userID int) (GetAccountResponse, error)
	ShowAccountByStudentID(studentID string) (GetAccountResponse, error)
	CreateAccount(req *UpdateAccoutRequest) (GetAccountResponse, error)
	UpdateAccount(userID int, req *UpdateAccoutRequest) (GetAccountResponse, error)
	DeleteAccount(userID int) error

	Login(req *LoginRequest) (LoginResponse, domain.Session, error)
}

type accountController struct {
	AccountInteractor interactor.AccountInteractor
}

// NewAccountController
func NewAccountController(ai interactor.AccountInteractor) AccountController {
	return &accountController{
		AccountInteractor: ai,
	}
}

func (ac *accountController) ShowAccountByUserID(userID int) (res GetAccountResponse, err error) {
	user, err := ac.AccountInteractor.FetchAccountByUserID(userID)
	if err != nil {
		return
	}
	res.ID = user.ID
	res.Name = user.Name
	res.StudentID = user.StudentID
	res.Role = user.Role
	res.Department = user.Department
	res.Grade = user.Grade
	res.Comment = user.Comment
	return
}

func (ac *accountController) ShowAccountByStudentID(studentID string) (res GetAccountResponse, err error) {
	user, err := ac.AccountInteractor.FetchAccountByStudentID(studentID)
	if err != nil {
		return
	}
	res.ID = user.ID
	res.Name = user.Name
	res.StudentID = user.StudentID
	res.Role = user.Role
	res.Department = user.Department
	res.Grade = user.Grade
	res.Comment = user.Comment
	return
}

type GetAccountResponse struct {
	ID         int    `json:"id"`
	Name       string `json:"name"`
	StudentID  string `json:"student_id"`
	Role       string `json:"role"`
	Department string `json:"department"`
	Grade      int    `json:"grade"`
	Comment    string `json:"comments"`
}

func (ac *accountController) CreateAccount(req *UpdateAccoutRequest) (res GetAccountResponse, err error) {
	// TODO: リクエストのバリデーションチェック
	if req.Password == "" {
		logger.Warn("CreateAccount: password is empty")
		return res, domain.BadRequest(errors.New("password is empty"))
	}
	if req.StudentID == "" {
		logger.Warn("CreateAccount: studentID is empty")
		return res, domain.BadRequest(errors.New("studentID is empty"))
	}

	// interactor
	user, err := ac.AccountInteractor.AddAccount(req.Name, req.Password, req.Role, req.StudentID, req.Department, req.Comment, req.Grade)
	if err != nil {
		return
	}

	// resをつくる
	res.Name = user.Name
	res.StudentID = user.StudentID
	res.Role = user.Role
	res.Department = user.Department
	res.Grade = user.Grade
	res.Comment = user.Comment
	return
}

type UpdateAccoutRequest struct {
	Name       string `json:"name"`
	StudentID  string `json:"student_id"`
	Password   string `json:"password"`
	Role       string `json:"role"`
	Department string `json:"department"`
	Grade      int    `json:"grade"`
	Comment    string `json:"comment"`
}

func (ac *accountController) UpdateAccount(userID int, req *UpdateAccoutRequest) (res GetAccountResponse, err error) {
	user, err := ac.AccountInteractor.UpdateAccount(userID, req.Name, req.Password, req.Role, req.StudentID, req.Department, req.Comment, req.Grade)
	if err != nil {
		return res, err
	}

	res.Name = user.Name
	res.StudentID = user.StudentID
	res.Role = user.Role
	res.Department = user.Department
	res.Grade = user.Grade
	res.Comment = user.Comment
	return
}

func (ac *accountController) DeleteAccount(userID int) error {
	// TODO: 実装して
	err := ac.AccountInteractor.DeleteAccount(userID)
	return err
}

func (ac *accountController) Login(req *LoginRequest) (res LoginResponse, sess domain.Session, err error) {
	// バリデーションチェック
	if req.StudentID == "" {
		logger.Warn("studentID is empty")
		return res, sess, domain.BadRequest(errors.New("studentID is empty"))
	}
	if req.Password == "" {
		logger.Warn("password is empty")
		return res, sess, domain.BadRequest(errors.New("studentID is empty"))
	}

	// いんたらくた
	sess, err = ac.AccountInteractor.Login(req.StudentID, req.Password)
	if err != nil {
		return res, sess, err
	}

	// れすぽんす
	res.StudentID = req.StudentID
	return
}

type LoginRequest struct {
	StudentID string `json:"student_id"`
	Password  string `json:"password"`
}

type LoginResponse struct {
	StudentID string `json:"student_id"`
}
