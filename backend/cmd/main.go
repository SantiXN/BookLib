package main

import (
	"errors"
	"fmt"
	"net/http"
	"os"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/mysql"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/gorilla/mux"

	"booklib/api"
	inframysql "booklib/pkg/infrastructure/mysql"
	"booklib/pkg/infrastructure/transport"
)

func main() {
	fmt.Println("Starting...")
	router := mux.NewRouter()
	//router.Use(auth.JwtAuthentication)

	fmt.Println("Initializing DB connection...")
	db, err := inframysql.InitDBConnection()
	if err != nil {
		panic(err)
	}
	dbInstance, err := mysql.WithInstance(db.DB, &mysql.Config{})
	if err != nil {
		panic(err)
	}
	migrationSource := "file:///app/data/migrations"

	fmt.Println("Creating migrator...")
	m, err := migrate.NewWithDatabaseInstance(migrationSource, "mysql", dbInstance)
	if err != nil {
		panic(err)
	}
	if err := m.Up(); err != nil && !errors.Is(err, migrate.ErrNoChange) {
		panic(err)
	}

	publicAPI := transport.NewPublicAPI()
	publicAPIHandler := api.NewStrictHandler(
		publicAPI,
		[]api.StrictMiddlewareFunc{
			//openapi.NewLoggingMiddleware(dc.TokenParser, logger),
			//public.NewPublicAPIErrorsMiddleware(),
		},
	)

	router.PathPrefix("/api/").Handler(api.Handler(publicAPIHandler))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	fmt.Println(port)

	fmt.Println("Starting server...")
	err = http.ListenAndServe(":"+port, router)
	if err != nil {
		fmt.Print(err)
	}
}
