package main

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/CB-AutoStack/AutoStack/apps/api-valuations/internal/auth"
	"github.com/CB-AutoStack/AutoStack/apps/api-valuations/internal/handlers"
	"github.com/CB-AutoStack/AutoStack/apps/api-valuations/internal/middleware"
	"github.com/CB-AutoStack/AutoStack/apps/api-valuations/internal/repository"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"github.com/sirupsen/logrus"
)

func main() {
	// Initialize logger
	logger := logrus.New()
	logger.SetFormatter(&logrus.JSONFormatter{})
	logger.SetLevel(logrus.InfoLevel)

	// Get configuration from environment
	dataPath := getEnv("DATA_PATH", "/app/data/seed")
	jwtSecret := getEnv("JWT_SECRET", "dev-jwt-secret-change-in-production")
	port := getEnv("PORT", "8002")

	logger.Info("Starting API Valuations service...")
	logger.WithFields(logrus.Fields{
		"data_path": dataPath,
		"port":      port,
	}).Info("Configuration loaded")

	// Initialize repository
	repo, err := repository.NewRepository(dataPath, logger)
	if err != nil {
		logger.WithError(err).Fatal("Failed to initialize repository")
	}

	// Initialize JWT manager
	jwtManager := auth.NewJWTManager(jwtSecret, 24*time.Hour)

	// Initialize handlers
	healthHandler := handlers.NewHealthHandler(logger)
	authHandler := handlers.NewAuthHandler(repo, jwtManager, logger)
	valuationHandler := handlers.NewValuationHandler(repo, logger)

	// Setup router
	r := mux.NewRouter()

	// Public routes
	r.HandleFunc("/health", healthHandler.HandleHealth).Methods("GET")
	r.HandleFunc("/api/v1/auth/login", authHandler.HandleLogin).Methods("POST")

	// Protected routes
	api := r.PathPrefix("/api/v1").Subrouter()
	api.Use(middleware.AuthMiddleware(jwtManager, logger))

	api.HandleFunc("/valuations", valuationHandler.HandleListValuations).Methods("GET")
	api.HandleFunc("/valuations/{id}", valuationHandler.HandleGetValuation).Methods("GET")
	api.HandleFunc("/valuations/estimate", valuationHandler.HandleEstimateValuation).Methods("POST")
	api.HandleFunc("/valuations/summary", valuationHandler.HandleGetValuationSummary).Methods("GET")

	// Add logging middleware to all routes
	r.Use(middleware.LoggingMiddleware(logger))

	// Setup CORS
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	}).Handler(r)

	// Start server
	addr := fmt.Sprintf(":%s", port)
	logger.WithField("address", addr).Info("Server starting")

	if err := http.ListenAndServe(addr, corsHandler); err != nil {
		logger.WithError(err).Fatal("Server failed to start")
	}
}

// getEnv gets an environment variable with a default value
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
