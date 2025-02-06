package model

type ArticleRepository interface {
	NextID() (int, error)
	Store(article Article) error
	FindOne(id int) (Article, error)
	Remove(id int) error
}

type ArticleStatus int

const (
	Unpublished ArticleStatus = iota
	Published
)

type Article interface {
	ID() int
	Title() string
	Content() string
	AuthorID() int
	Status() ArticleStatus

	SetTitle(title string)
	SetContent(content string)
	SetStatus(status ArticleStatus)
}

func NewArticle(
	id int,
	title string,
	content string,
	authorID int,
	status ArticleStatus,
) Article {
	return &article{
		id:       id,
		title:    title,
		content:  content,
		authorID: authorID,
		status:   status,
	}
}

type article struct {
	id       int
	title    string
	content  string
	authorID int
	status   ArticleStatus
}

func (a *article) ID() int {
	return a.id
}

func (a *article) Title() string {
	return a.title
}

func (a *article) Content() string {
	return a.content
}

func (a *article) AuthorID() int {
	return a.authorID
}

func (a *article) Status() ArticleStatus {
	return a.status
}

func (a *article) SetTitle(title string) {
	a.title = title
}

func (a *article) SetContent(content string) {
	a.content = content
}

func (a *article) SetStatus(status ArticleStatus) {
	a.status = status
}
