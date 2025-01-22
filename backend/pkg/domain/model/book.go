package model

type BookRepository interface {
	NextID() (int, error)
	Store(book Book) error
	StoreAll(books []Book) error
	FindOne(id int) (Book, error)
	FindAll(ids []int) ([]Book, error)
	Remove(id int) error
}

type Book interface {
	ID() int
	Title() string
	Description() *string
	FilePath() string
	CoverPath() *string
	AuthorIDs() []int
	CategoryIDs() []int
	CreatedBy() int

	SetTitle(title string)
	SetDescription(description string)
	SetCoverPath(coverPath string)
}

func NewBook(
	id int,
	title string,
	description *string,
	filePath string,
	coverPath *string,
	authorIDs []int,
	categoryIDs []int,
	createdBy int,
) Book {
	return &book{
		id:          id,
		title:       title,
		description: description,
		filePath:    filePath,
		coverPath:   coverPath,
		authorIDs:   authorIDs,
		categoryIDs: categoryIDs,
		createdBy:   createdBy,
	}
}

type book struct {
	id          int
	title       string
	description *string
	filePath    string
	coverPath   *string
	authorIDs   []int
	categoryIDs []int
	createdBy   int
}

func (b *book) ID() int {
	return b.id
}

func (b *book) Title() string {
	return b.title
}

func (b *book) Description() *string {
	return b.description
}

func (b *book) FilePath() string {
	return b.filePath
}

func (b *book) CoverPath() *string {
	return b.coverPath
}

func (b *book) AuthorIDs() []int {
	return b.authorIDs
}

func (b *book) CategoryIDs() []int {
	return b.categoryIDs
}

func (b *book) CreatedBy() int {
	return b.createdBy
}

func (b *book) SetTitle(title string) {
	b.title = title
}

func (b *book) SetDescription(description string) {
	b.description = &description
}

func (b *book) SetCoverPath(coverPath string) {
	b.coverPath = &coverPath
}
