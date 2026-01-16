package repository

import (
	"os"
	"path/filepath"
	"testing"

	"github.com/sirupsen/logrus"
)

func TestNewRepository(t *testing.T) {
	logger := logrus.New()
	logger.SetOutput(os.Stdout)

	// Use test data path
	dataPath := filepath.Join("..", "..", "..", "..", "data", "seed")

	repo, err := NewRepository(dataPath, logger)
	if err != nil {
		t.Fatalf("Failed to create repository: %v", err)
	}

	if repo == nil {
		t.Fatal("Repository is nil")
	}

	// Check users loaded
	users := repo.users
	if len(users) == 0 {
		t.Error("No users loaded")
	}
	t.Logf("Loaded %d users", len(users))

	// Check valuations loaded
	valuations := repo.GetAllValuations()
	if len(valuations) == 0 {
		t.Error("No valuations loaded")
	}
	t.Logf("Loaded %d valuations", len(valuations))
}

func TestGetUserByEmail(t *testing.T) {
	logger := logrus.New()
	logger.SetOutput(os.Stdout)
	dataPath := filepath.Join("..", "..", "..", "..", "data", "seed")

	repo, err := NewRepository(dataPath, logger)
	if err != nil {
		t.Fatalf("Failed to create repository: %v", err)
	}

	// Test existing user
	user, err := repo.GetUserByEmail("demo@autostack.com")
	if err != nil {
		t.Fatalf("Failed to get user: %v", err)
	}
	if user.Email != "demo@autostack.com" {
		t.Errorf("Expected email demo@autostack.com, got %s", user.Email)
	}
	t.Logf("Found user: %s (%s)", user.Name, user.Email)

	// Test non-existing user
	_, err = repo.GetUserByEmail("nonexistent@autostack.com")
	if err == nil {
		t.Error("Expected error for non-existent user")
	}
}

func TestGetAllValuations(t *testing.T) {
	logger := logrus.New()
	logger.SetOutput(os.Stdout)
	dataPath := filepath.Join("..", "..", "..", "..", "data", "seed")

	repo, err := NewRepository(dataPath, logger)
	if err != nil {
		t.Fatalf("Failed to create repository: %v", err)
	}

	valuations := repo.GetAllValuations()
	if len(valuations) == 0 {
		t.Error("Expected valuations but got none")
	}

	t.Logf("Found %d valuations", len(valuations))

	// Check first valuation structure
	if len(valuations) > 0 {
		v := valuations[0]
		t.Logf("First valuation: %d %s %s - $%.2f", v.Year, v.Make, v.Model, v.EstimatedValue)

		if v.Year == 0 {
			t.Error("Valuation year is zero")
		}
		if v.Make == "" {
			t.Error("Valuation make is empty")
		}
		if v.EstimatedValue == 0 {
			t.Error("Valuation estimated value is zero")
		}
	}
}

func TestGetValuationByID(t *testing.T) {
	logger := logrus.New()
	logger.SetOutput(os.Stdout)
	dataPath := filepath.Join("..", "..", "..", "..", "data", "seed")

	repo, err := NewRepository(dataPath, logger)
	if err != nil {
		t.Fatalf("Failed to create repository: %v", err)
	}

	// Get first valuation to test
	valuations := repo.GetAllValuations()
	if len(valuations) == 0 {
		t.Fatal("No valuations to test")
	}

	firstValuation := valuations[0]
	t.Logf("Testing with valuation ID: %s", firstValuation.ID)

	// Test getting by ID
	valuation, err := repo.GetValuationByID(firstValuation.ID)
	if err != nil {
		t.Fatalf("Failed to get valuation: %v", err)
	}

	if valuation.ID != firstValuation.ID {
		t.Errorf("Expected valuation ID %s, got %s", firstValuation.ID, valuation.ID)
	}

	// Test non-existent ID
	_, err = repo.GetValuationByID("nonexistent-id")
	if err == nil {
		t.Error("Expected error for non-existent valuation")
	}
}
