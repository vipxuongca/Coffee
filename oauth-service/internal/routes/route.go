package routes

import (
	"github.com/go-chi/chi/v5"
	"oauth-service/internal/handler"
)

func Register(r *chi.Mux) {
	r.Post("/auth/google/login", handlers.GoogleLogin)
}
