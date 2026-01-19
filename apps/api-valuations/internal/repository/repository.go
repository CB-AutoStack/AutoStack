package repository

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sync"

	"github.com/CB-AutoStack/AutoStack/apps/api-valuations/internal/models"
	"github.com/sirupsen/logrus"
)

// Repository provides data access for users and valuations
type Repository struct {
	users      map[string]*models.User
	valuations map[string]*models.Valuation
	mu         sync.RWMutex
	logger     *logrus.Logger
}

// NewRepository creates a new repository and loads data from JSON files
func NewRepository(dataPath string, logger *logrus.Logger) (*Repository, error) {
	repo := &Repository{
		users:      make(map[string]*models.User),
		valuations: make(map[string]*models.Valuation),
		logger:     logger,
	}

	// Load users
	if err := repo.loadUsers(filepath.Join(dataPath, "users.json")); err != nil {
		return nil, fmt.Errorf("failed to load users: %w", err)
	}

	// Load valuations
	if err := repo.loadValuations(filepath.Join(dataPath, "valuations.json")); err != nil {
		return nil, fmt.Errorf("failed to load valuations: %w", err)
	}

	logger.Infof("Loaded %d users and %d valuations from %s", len(repo.users), len(repo.valuations), dataPath)

	return repo, nil
}

// loadUsers loads users from a JSON file
func (r *Repository) loadUsers(filePath string) error {
	data, err := os.ReadFile(filePath)
	if err != nil {
		return err
	}

	var users []*models.User
	if err := json.Unmarshal(data, &users); err != nil {
		return err
	}

	r.mu.Lock()
	defer r.mu.Unlock()

	for _, user := range users {
		r.users[user.ID] = user
	}

	return nil
}

// loadValuations loads valuations from a JSON file
func (r *Repository) loadValuations(filePath string) error {
	data, err := os.ReadFile(filePath)
	if err != nil {
		return err
	}

	var valuations []*models.Valuation
	if err := json.Unmarshal(data, &valuations); err != nil {
		return err
	}

	r.mu.Lock()
	defer r.mu.Unlock()

	for _, valuation := range valuations {
		r.valuations[valuation.ID] = valuation
	}

	return nil
}

// GetUserByID retrieves a user by ID
func (r *Repository) GetUserByID(userID string) (*models.User, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	user, exists := r.users[userID]
	if !exists {
		return nil, fmt.Errorf("user not found")
	}

	return user, nil
}

// GetUserByEmail retrieves a user by email address
func (r *Repository) GetUserByEmail(email string) (*models.User, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	for _, user := range r.users {
		if user.Email == email {
			return user, nil
		}
	}

	return nil, fmt.Errorf("user not found")
}

// GetAllValuations returns all valuations
func (r *Repository) GetAllValuations() []*models.Valuation {
	r.mu.RLock()
	defer r.mu.RUnlock()

	valuations := make([]*models.Valuation, 0, len(r.valuations))
	for _, valuation := range r.valuations {
		valuations = append(valuations, valuation)
	}

	return valuations
}

// GetValuationByID retrieves a valuation by ID
func (r *Repository) GetValuationByID(valuationID string) (*models.Valuation, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	valuation, exists := r.valuations[valuationID]
	if !exists {
		return nil, fmt.Errorf("valuation not found")
	}

	return valuation, nil
}
