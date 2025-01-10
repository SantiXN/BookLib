FROM golang:1.23

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы для загрузки зависимостей
COPY go.mod go.sum ./
RUN go mod tidy && go mod vendor

# Устанавливаем oapi-codegen
RUN go install github.com/deepmap/oapi-codegen/cmd/oapi-codegen@latest

# Копируем весь проект
COPY . .

# Генерируем код OpenAPI
RUN oapi-codegen -config ./api/oapi-config.yaml ./api/api.yaml > ./api/generated.go

# Собираем приложение
RUN go build -v -o ./bin/main ./cmd/main.go

# Открываем порт
EXPOSE 8080

# Команда запуска
CMD ["./bin/main"]
