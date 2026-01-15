.PHONY: help build up down restart logs logs-web logs-inventory logs-valuations ps clean test seed health

# Load environment variables from .env if it exists
ifneq (,$(wildcard ./.env))
    include .env
    export
endif

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build all Docker images
	@echo "Building all services..."
	docker-compose build

up: ## Start all services
	@echo "Starting all services..."
	docker-compose up -d
	@echo ""
	@echo "Services starting..."
	@echo "  Web:         http://localhost:${WEB_PORT:-3000}"
	@echo "  Inventory:   http://localhost:${INVENTORY_PORT:-8001}"
	@echo "  Valuations:  http://localhost:${VALUATIONS_PORT:-8002}"
	@echo ""
	@echo "Run 'make logs' to view logs"
	@echo "Run 'make health' to check service health"

down: ## Stop all services
	@echo "Stopping all services..."
	docker-compose down

restart: down up ## Restart all services

logs: ## View logs from all services
	docker-compose logs -f

logs-web: ## View logs from web service
	docker-compose logs -f web

logs-inventory: ## View logs from inventory API
	docker-compose logs -f api-inventory

logs-valuations: ## View logs from valuations API
	docker-compose logs -f api-valuations

ps: ## List running services
	docker-compose ps

clean: ## Stop services and remove volumes
	@echo "Stopping services and removing volumes..."
	docker-compose down -v
	@echo "Cleaning up..."
	docker system prune -f

rebuild: clean build up ## Clean rebuild and start all services

health: ## Check health of all services
	@echo "Checking service health..."
	@echo ""
	@echo "Web Service:"
	@curl -f http://localhost:${WEB_PORT:-3000} > /dev/null 2>&1 && echo "  ✓ Web is healthy" || echo "  ✗ Web is not responding"
	@echo ""
	@echo "Inventory API:"
	@curl -f http://localhost:${INVENTORY_PORT:-8001}/health > /dev/null 2>&1 && echo "  ✓ Inventory API is healthy" || echo "  ✗ Inventory API is not responding"
	@echo ""
	@echo "Valuations API:"
	@curl -f http://localhost:${VALUATIONS_PORT:-8002}/health > /dev/null 2>&1 && echo "  ✓ Valuations API is healthy" || echo "  ✗ Valuations API is not responding"

seed: ## Load mock data (in-memory)
	@echo "Mock data is loaded from JSON files on service startup"
	@echo "Data files located in: data/seed/"
	@echo "To reload data, restart the services with 'make restart'"

test: ## Run all tests
	@echo "Running tests..."
	@echo ""
	@echo "Testing Inventory API..."
	cd apps/api-inventory && go test ./... -v
	@echo ""
	@echo "Testing Valuations API..."
	cd apps/api-valuations && go test ./... -v
	@echo ""
	@echo "Testing Web Application..."
	cd apps/web && npm test

test-integration: ## Run integration tests
	@echo "Running integration tests..."
	@echo "Checking if services are running..."
	@make health
	@echo ""
	@echo "Testing vehicle search..."
	@curl -s http://localhost:${INVENTORY_PORT:-8001}/api/v1/vehicles | jq '.data | length' || echo "Failed to fetch vehicles"
	@echo ""
	@echo "Testing valuation..."
	@curl -s http://localhost:${VALUATIONS_PORT:-8002}/api/v1/valuations | jq '.data | length' || echo "Failed to fetch valuations"

dev-web: ## Run web app in development mode
	cd apps/web && npm run dev

dev-inventory: ## Run inventory API in development mode
	cd apps/api-inventory && go run cmd/server/main.go

dev-valuations: ## Run valuations API in development mode
	cd apps/api-valuations && go run cmd/server/main.go
