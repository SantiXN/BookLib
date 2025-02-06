package model

type Category struct {
	ID   int
	Name string
}

type Book struct {
	ID          int
	Title       string
	Description *string
	FilePath    string
	CoverPath   string
	Authors     []Author
	Categories  []Category
	StarCount   float32
}
