package models

import "time"

// Valuation represents a vehicle valuation record
type Valuation struct {
	ID               string    `json:"id"`
	Year             int       `json:"year"`
	Make             string    `json:"make"`
	Model            string    `json:"model"`
	Mileage          int       `json:"mileage"`
	Condition        string    `json:"condition"`
	EstimatedValue   float64   `json:"estimatedValue"`
	MarketValue      float64   `json:"marketValue"`
	DepreciationRate float64   `json:"depreciationRate"`
	CalculatedAt     time.Time `json:"calculatedAt"`
}

// ValuationRequest represents a request for vehicle valuation
type ValuationRequest struct {
	Year      int    `json:"year"`
	Make      string `json:"make"`
	Model     string `json:"model"`
	Mileage   int    `json:"mileage"`
	Condition string `json:"condition"`
	Currency  string `json:"currency,omitempty"`
}

// ValuationResponse represents a valuation response
type ValuationResponse struct {
	EstimatedValue   float64 `json:"estimatedValue"`
	MarketValue      float64 `json:"marketValue"`
	DepreciationRate float64 `json:"depreciationRate"`
	Currency         string  `json:"currency"`
	Confidence       string  `json:"confidence"`
}
