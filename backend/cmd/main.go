package main

import (
	"booklib/pkg/infrastructure"
	"context"
	"errors"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/mysql"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/gorilla/mux"
	"github.com/rs/cors"

	"booklib/api"
	"booklib/pkg/infrastructure/auth"
	inframysql "booklib/pkg/infrastructure/mysql"
	"booklib/pkg/infrastructure/transport"
)

func main() {
	fmt.Println("Starting...")

	// Create root context with cancellation
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Graceful shutdown handling
	go func() {
		sig := make(chan os.Signal, 1)
		signal.Notify(sig, os.Interrupt, syscall.SIGTERM)
		<-sig
		fmt.Println("\nShutting down...")
		cancel()
	}()

	router := mux.NewRouter()
	router.Use(auth.JwtAuthentication)

	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})
	router.Use(corsHandler.Handler)

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

	dependencyContainer := infrastructure.NewDependencyContainer(ctx, *db)

	publicAPI := transport.NewPublicAPI(dependencyContainer.UserService)
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

	//fmt.Println("Starting server...")
	//err = http.ListenAndServe(":"+port, router)
	//if err != nil {
	//	fmt.Print(err)
	//}

	server := &http.Server{
		Addr:    ":" + port,
		Handler: router,
	}
	go func() {
		if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			fmt.Printf("HTTP server error: %s\n", err)
		}
	}()

	// Wait for context cancellation
	<-ctx.Done()

	// Gracefully shutdown server with timeout
	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer shutdownCancel()

	if err := server.Shutdown(shutdownCtx); err != nil {
		fmt.Printf("Server shutdown error: %s\n", err)
	}
	fmt.Println("Server gracefully stopped")
}
