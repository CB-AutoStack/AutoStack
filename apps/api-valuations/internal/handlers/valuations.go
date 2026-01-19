package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/CB-AutoStack/AutoStack/apps/api-valuations/internal/models"
	"github.com/CB-AutoStack/AutoStack/apps/api-valuations/internal/repository"
	"github.com/gorilla/mux"
	"github.com/sirupsen/logrus"
)

// ValuationHandler handles valuation-related requests
type ValuationHandler struct {
	repo   *repository.Repository
	logger *logrus.Logger
}

// NewValuationHandler creates a new valuation handler
func NewValuationHandler(repo *repository.Repository, logger *logrus.Logger) *ValuationHandler {
	return &ValuationHandler{
		repo:   repo,
		logger: logger,
	}
}

// HandleListValuations returns all historical valuations
func (h *ValuationHandler) HandleListValuations(w http.ResponseWriter, r *http.Request) {
	valuations := h.repo.GetAllValuations()

	response := map[string]interface{}{
		"data":  valuations,
		"count": len(valuations),
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

// HandleGetValuation returns a single valuation by ID
func (h *ValuationHandler) HandleGetValuation(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	valuationID := vars["id"]

	valuation, err := h.repo.GetValuationByID(valuationID)
	if err != nil {
		h.logger.WithField("valuation_id", valuationID).Warn("Valuation not found")
		http.Error(w, "Valuation not found", http.StatusNotFound)
		return
	}

	response := map[string]interface{}{
		"data": valuation,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

// HandleEstimateValuation handles instant valuation requests
func (h *ValuationHandler) HandleEstimateValuation(w http.ResponseWriter, r *http.Request) {
	var req models.ValuationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.logger.WithError(err).Warn("Invalid valuation request")
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate request
	if req.Year == 0 || req.Make == "" || req.Model == "" {
		http.Error(w, "Year, make, and model are required", http.StatusBadRequest)
		return
	}

	// Calculate valuation
	valuation := h.calculateValuation(&req)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"data": valuation,
	})

	h.logger.WithFields(logrus.Fields{
		"year":            req.Year,
		"make":            req.Make,
		"model":           req.Model,
		"estimated_value": valuation.EstimatedValue,
	}).Info("Valuation calculated")
}

// calculateValuation calculates a vehicle valuation based on the request
// This is a simplified algorithm for demo purposes
func (h *ValuationHandler) calculateValuation(req *models.ValuationRequest) *models.ValuationResponse {
	currentYear := time.Now().Year()
	age := currentYear - req.Year

	// Base market value (simplified for demo)
	baseValue := 50000.0 // Starting base value

	// Depreciation based on age (simplified)
	depreciationRate := 0.15 // 15% per year
	if age > 0 {
		depreciationRate = float64(age) * 0.15
		if depreciationRate > 0.60 {
			depreciationRate = 0.60 // Cap at 60% depreciation
		}
	}

	// Adjust for mileage
	mileageAdjustment := 0.0
	if req.Mileage > 0 {
		// Reduce value by $0.10 per mile over 15,000 miles per year
		expectedMileage := age * 15000
		excessMileage := req.Mileage - expectedMileage
		if excessMileage > 0 {
			mileageAdjustment = float64(excessMileage) * 0.10
		}
	}

	// Adjust for condition
	conditionMultiplier := 1.0
	switch req.Condition {
	case "excellent":
		conditionMultiplier = 1.1
	case "good":
		conditionMultiplier = 1.0
	case "fair":
		conditionMultiplier = 0.9
	case "poor":
		conditionMultiplier = 0.75
	}

	// Calculate final values
	marketValue := baseValue * (1 - depreciationRate) * conditionMultiplier
	estimatedValue := marketValue - mileageAdjustment

	// Ensure positive values
	if estimatedValue < 1000 {
		estimatedValue = 1000
	}
	if marketValue < 1000 {
		marketValue = 1000
	}

	// Determine confidence level
	confidence := "medium"
	if age <= 3 && req.Mileage < 50000 {
		confidence = "high"
	} else if age > 10 || req.Mileage > 150000 {
		confidence = "low"
	}

	// Default currency
	currency := req.Currency
	if currency == "" {
		currency = "USD"
	}

	return &models.ValuationResponse{
		EstimatedValue:   estimatedValue,
		MarketValue:      marketValue,
		DepreciationRate: depreciationRate,
		Currency:         currency,
		Confidence:       confidence,
	}
}

// HandleGetValuationSummary returns summary statistics
func (h *ValuationHandler) HandleGetValuationSummary(w http.ResponseWriter, r *http.Request) {
	valuations := h.repo.GetAllValuations()

	totalValue := 0.0
	avgDepreciation := 0.0

	for _, v := range valuations {
		totalValue += v.EstimatedValue
		avgDepreciation += v.DepreciationRate
	}

	count := len(valuations)
	if count > 0 {
		avgDepreciation = avgDepreciation / float64(count)
	}

	response := map[string]interface{}{
		"totalValuations":      count,
		"totalValue":           fmt.Sprintf("%.2f", totalValue),
		"averageDepreciation":  fmt.Sprintf("%.2f%%", avgDepreciation*100),
		"calculatedAt":         time.Now().Format(time.RFC3339),
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}
