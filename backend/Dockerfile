FROM golang:1.23

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod tidy
RUN go mod vendor

COPY . .

RUN go build -v -o ./bin/main ./cmd/main.go

EXPOSE 8080

CMD ["./bin/main"]
