package handlers

import (
	"testing"

	"github.com/CB-AutoStack/AutoStack/apps/api-valuations/internal/models"
	"github.com/sirupsen/logrus"
)

func TestCalculateValuation(t *testing.T) {
	logger := logrus.New()
	handler := &ValuationHandler{
		logger: logger,
	}

	tests := []struct {
		name          string
		request       *models.ValuationRequest
		expectValue   bool
		expectConfidence string
	}{
		{
			name: "New car with low mileage - high confidence",
			request: &models.ValuationRequest{
				Year:      2023,
				Make:      "Honda",
				Model:     "Civic",
				Mileage:   5000,
				Condition: "excellent",
				Currency:  "USD",
			},
			expectValue:      true,
			expectConfidence: "high",
		},
		{
			name: "Older car with high mileage - low confidence",
			request: &models.ValuationRequest{
				Year:      2010,
				Make:      "Honda",
				Model:     "Civic",
				Mileage:   180000,
				Condition: "fair",
				Currency:  "USD",
			},
			expectValue:      true,
			expectConfidence: "low",
		},
		{
			name: "Mid-age car good condition - medium confidence",
			request: &models.ValuationRequest{
				Year:      2020,
				Make:      "Toyota",
				Model:     "Camry",
				Mileage:   45000,
				Condition: "good",
				Currency:  "USD",
			},
			expectValue:      true,
			expectConfidence: "medium",
		},
		{
			name: "Poor condition affects value",
			request: &models.ValuationRequest{
				Year:      2020,
				Make:      "Honda",
				Model:     "Accord",
				Mileage:   50000,
				Condition: "poor",
				Currency:  "USD",
			},
			expectValue:      true,
			expectConfidence: "medium",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := handler.calculateValuation(tt.request)

			if result == nil {
				t.Fatal("Result is nil")
			}

			if tt.expectValue && result.EstimatedValue == 0 {
				t.Error("Expected non-zero estimated value")
			}

			if result.EstimatedValue < 0 {
				t.Error("Estimated value should not be negative")
			}

			if result.MarketValue < 0 {
				t.Error("Market value should not be negative")
			}

			if result.DepreciationRate < 0 || result.DepreciationRate > 1 {
				t.Errorf("Depreciation rate should be between 0 and 1, got %f", result.DepreciationRate)
			}

			if result.Confidence != tt.expectConfidence {
				t.Errorf("Expected confidence %s, got %s", tt.expectConfidence, result.Confidence)
			}

			if result.Currency != tt.request.Currency {
				t.Errorf("Expected currency %s, got %s", tt.request.Currency, result.Currency)
			}

			t.Logf("Valuation: %d %s %s (%s, %d miles) = $%.2f (confidence: %s, depreciation: %.1f%%)",
				tt.request.Year,
				tt.request.Make,
				tt.request.Model,
				tt.request.Condition,
				tt.request.Mileage,
				result.EstimatedValue,
				result.Confidence,
				result.DepreciationRate*100,
			)
		})
	}
}

func TestCalculateValuationDifferentCurrencies(t *testing.T) {
	logger := logrus.New()
	handler := &ValuationHandler{
		logger: logger,
	}

	currencies := []string{"USD", "GBP", "EUR", "CAD", "AUD"}

	for _, currency := range currencies {
		t.Run("Currency_"+currency, func(t *testing.T) {
			request := &models.ValuationRequest{
				Year:      2022,
				Make:      "BMW",
				Model:     "3 Series",
				Mileage:   15000,
				Condition: "good",
				Currency:  currency,
			}

			result := handler.calculateValuation(request)

			if result.Currency != currency {
				t.Errorf("Expected currency %s, got %s", currency, result.Currency)
			}

			t.Logf("Valuation in %s: %.2f", currency, result.EstimatedValue)
		})
	}
}

func TestCalculateValuationConditionImpact(t *testing.T) {
	logger := logrus.New()
	handler := &ValuationHandler{
		logger: logger,
	}

	conditions := []string{"excellent", "good", "fair", "poor"}
	var previousValue float64

	for i, condition := range conditions {
		t.Run("Condition_"+condition, func(t *testing.T) {
			request := &models.ValuationRequest{
				Year:      2022,
				Make:      "Honda",
				Model:     "Accord",
				Mileage:   30000,
				Condition: condition,
				Currency:  "USD",
			}

			result := handler.calculateValuation(request)

			// Excellent should be worth more than good, good more than fair, etc.
			if i > 0 && result.EstimatedValue >= previousValue {
				t.Errorf("Expected %s condition to be worth less than previous condition, got $%.2f vs $%.2f",
					condition, result.EstimatedValue, previousValue)
			}

			previousValue = result.EstimatedValue
			t.Logf("Condition %s: $%.2f", condition, result.EstimatedValue)
		})
	}
}

func TestCalculateValuationMileageImpact(t *testing.T) {
	logger := logrus.New()
	handler := &ValuationHandler{
		logger: logger,
	}

	mileages := []int{10000, 50000, 100000, 150000}

	for _, mileage := range mileages {
		t.Run("Mileage_"+string(rune(mileage)), func(t *testing.T) {
			request := &models.ValuationRequest{
				Year:      2020,
				Make:      "Toyota",
				Model:     "Camry",
				Mileage:   mileage,
				Condition: "good",
				Currency:  "USD",
			}

			result := handler.calculateValuation(request)

			t.Logf("Mileage %d: $%.2f", mileage, result.EstimatedValue)
		})
	}
}
