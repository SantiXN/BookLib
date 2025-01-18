package mysql

import (
	"fmt"
	"time"

	"github.com/jmoiron/sqlx"
)

const (
	dbDriverName = "mysql"
	dsn          = "user:password@tcp(db_db:3306)/app?charset=utf8mb4&collation=utf8mb4_unicode_ci&parseTime=true"
)

func InitDBConnection() (*sqlx.DB, error) {
	dbx, err := sqlx.Open(dbDriverName, dsn)
	if err != nil {
		fmt.Printf("open db err: %v\n", err)
		return nil, err
	}
	waitForDB(dbx)

	return dbx, nil
}

func waitForDB(db *sqlx.DB) {
	for {
		if err := db.Ping(); err == nil {
			break
		}
		time.Sleep(1 * time.Second)
	}
}
