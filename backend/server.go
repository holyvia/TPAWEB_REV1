package main

import (
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/gorilla/mux"
	"github.com/holyvia/gqlgen-todos/config"
	"github.com/holyvia/gqlgen-todos/directives"
	"github.com/holyvia/gqlgen-todos/graph"
	"github.com/holyvia/gqlgen-todos/graph/generated"
	"github.com/holyvia/gqlgen-todos/graph/model"
	"github.com/holyvia/gqlgen-todos/middleware"
)

const defaultPort = "7070"

func MyCors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Add("Access-Control-Allow-Headers", "Content-Type,AccessToken,X-CSRF-Token, Authorization, Token")
		w.Header().Add("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("content-type", "application/json;charset=UTF-8")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	db := database.GetDB()
	db.AutoMigrate(&model.User{})
	db.AutoMigrate(&model.ActivationLink{})
	db.AutoMigrate(&model.ResetLink{})
	db.AutoMigrate(&model.Comment{})
	db.AutoMigrate(&model.Post{})
	db.AutoMigrate(&model.Job{})
	db.AutoMigrate(&model.Experience{})
	db.AutoMigrate(&model.Education{})

	c := generated.Config{Resolvers: &graph.Resolver{
		DB: db,
	}}
	c.Directives.Auth = directives.Auth

	srv := handler.NewDefaultServer(
		generated.NewExecutableSchema(c),
	)

	router := mux.NewRouter()
	router.Use(MyCors)
	router.Use(middleware.AuthMiddleware)
	router.Handle("/", playground.Handler("GraphQL playground", "/query"))
	router.Handle("/query", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}