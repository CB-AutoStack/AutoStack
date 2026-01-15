# AutoStack - Vehicle Marketplace Platform

AutoStack is a comprehensive vehicle marketplace demonstration platform built with modern cloud-native technologies, featuring CloudBees CI/CD integration and Feature Management.

## Architecture

AutoStack consists of three main services:

- **Web UI** (React + Vite) - Modern single-page application for browsing vehicles
- **API Inventory** (Go) - Vehicle inventory management and search
- **API Valuations** (Go) - Trade-in vehicle valuation service

All services are containerized and can be deployed to Kubernetes using the provided Helm charts.

## Features

- Vehicle search and filtering with multiple criteria
- International support (USD, GBP, EUR, CAD, AUD)
- Multi-country vehicle listings
- Instant trade-in valuations
- User authentication with JWT
- Feature flag management with CloudBees Feature Management
- Responsive web interface
- RESTful API design
- In-memory data storage (no database required for demo)

## CloudBees Feature Flags

AutoStack includes 8 automotive-specific feature flags:

1. **searchAlgorithm** (variant) - Control vehicle sorting: price-low-to-high, newest-first, recommended
2. **enableAdvancedFilters** (boolean) - Enable/disable advanced filtering UI
3. **showDealerRatings** (boolean) - Display dealer transparency ratings
4. **pricingDisplay** (variant) - Show total-price, monthly-payment, or both
5. **enableInstantTradeIn** (boolean) - Instant vs manual valuation workflow
6. **showFinancingCalculator** (boolean) - Display financing calculator widget
7. **enable360Photos** (boolean) - Enable 360-degree photo viewers
8. **vehicleRecommendations** (variant) - price-based, feature-based, or ai-powered recommendations

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Go 1.21+ (for local development)
- Make (optional, for convenience commands)

### Running with Docker Compose

1. Clone the repository:
```bash
git clone https://github.com/CB-AutoStack/AutoStack.git
cd AutoStack
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Build and start all services:
```bash
make build
make up
```

4. Access the application:
- Web UI: http://localhost:3000
- Inventory API: http://localhost:8001
- Valuations API: http://localhost:8002

### Demo Accounts

Use these credentials to log in:

- **US User**: demo@autostack.com / password (USD)
- **UK User**: james.smith@autostack.co.uk / password (GBP)
- **German User**: hans.mueller@autostack.de / password (EUR)
- **Canadian User**: emma.tremblay@autostack.ca / password (CAD)
- **Australian User**: liam.wilson@autostack.com.au / password (AUD)

## Development

### Project Structure

```
AutoStack/
├── apps/
│   ├── web/                 # React web application
│   ├── api-inventory/       # Vehicle inventory API (Go)
│   └── api-valuations/      # Valuation API (Go)
├── data/
│   └── seed/               # Mock data (JSON files)
├── helm/
│   └── autostack/          # Kubernetes Helm chart
├── .cloudbees/
│   └── workflows/          # CloudBees CI/CD workflows
├── docker-compose.yaml     # Local development setup
├── Makefile               # Convenience commands
└── README.md
```

### Available Commands

```bash
# Build services
make build

# Start services
make up

# Stop services
make down

# Restart services
make restart

# View logs
make logs

# Check service health
make health

# Clean up
make clean
```

## API Endpoints

### Authentication

- `POST /api/v1/auth/login` - User login (returns JWT token)

### Vehicles (Inventory API)

- `GET /api/v1/vehicles` - List all vehicles
- `GET /api/v1/vehicles/{id}` - Get vehicle details
- `POST /api/v1/vehicles/search` - Search vehicles with filters

### Valuations (Valuations API)

- `POST /api/v1/valuations/estimate` - Get instant valuation
- `GET /api/v1/valuations` - List valuation history
- `GET /api/v1/valuations/{id}` - Get valuation details
- `GET /api/v1/valuations/summary` - Get summary statistics

## Deployment

### Kubernetes Deployment

AutoStack includes a comprehensive Helm chart for Kubernetes deployment:

```bash
helm install autostack ./helm/autostack \
  --set deployment.hostname=autostack.example.com
```

### CloudBees CI/CD

AutoStack includes CloudBees workflows for automated build and deployment:

- `.cloudbees/workflows/build-and-test.yaml` - Build, test, and publish Docker images
- `.cloudbees/workflows/deploy.yaml` - Deploy to Kubernetes with Helm

## Mock Data

AutoStack includes realistic mock data for demonstration:

- 20 vehicles across 5 countries (US, GB, DE, CA, AU)
- 8 users from 6 different countries
- 3 historical valuations
- Multiple currencies (USD, GBP, EUR, CAD, AUD)

Mock data is loaded from JSON files in `data/seed/` directory.

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Go 1.21, Gorilla Mux, JWT authentication
- **Containerization**: Docker, Docker Compose
- **Orchestration**: Kubernetes, Helm
- **CI/CD**: CloudBees Pipelines
- **Feature Management**: CloudBees Feature Management (Rox)
- **Data Storage**: In-memory (JSON files)

## License

Copyright 2024 AutoStack. All rights reserved.
