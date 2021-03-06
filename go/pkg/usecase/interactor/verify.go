package interactor

// VerifyHandler パスワード検証を行うハンドラ
type VerifyHandler interface {
	// PasswordHash 生パスをハッシュする
	PasswordHash(pw string) (string, error)
	// PasswordVerify パスワードの検証をする
	PasswordVerify(hash, pw string) error
}
