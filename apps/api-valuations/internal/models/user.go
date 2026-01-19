package models

import "time"

// User represents a user in the system
type User struct {
	ID                string    `json:"id"`
	Email             string    `json:"email"`
	Password          string    `json:"password"`
	Name              string    `json:"name"`
	Country           string    `json:"country"`
	PreferredCurrency string    `json:"preferredCurrency"`
	Roles             []string  `json:"roles"`
	CreatedAt         time.Time `json:"createdAt"`
}
