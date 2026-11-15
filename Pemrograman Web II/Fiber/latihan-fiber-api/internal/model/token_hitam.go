package model

import "time"

type TokenHitam struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Token     string    `gorm:"size:500;uniqueIndex" json:"token"`
	ExpiredAt time.Time `json:"kedaluwarsa_pada"`
	CreatedAt time.Time `json:"dibuat_pada"`
}

