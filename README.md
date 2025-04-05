# BookLib

## Создание миграций
migrate create -ext sql -dir ./ create_author_book_table

go test -cover -coverprofile coverage.out ./pkg/domain/service

go tool cover -html coverage.out
