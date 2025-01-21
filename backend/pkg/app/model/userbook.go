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

type BookInLibrary struct {
	BookID        int
	Title         string
	CoverPath     *string
	Authors       []Author
	StarCount     float32
	ReadingStatus ReadingStatus
}
