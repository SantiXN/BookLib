package model

type UserBook struct {
	UserID int
	BookID int
	Status ReadingStatus
}

type ReadingStatus int

const (
	Planned ReadingStatus = iota
	InProgress
	Finished
)
