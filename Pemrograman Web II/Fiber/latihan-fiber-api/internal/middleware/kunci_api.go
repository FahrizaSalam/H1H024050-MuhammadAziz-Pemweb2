package middleware

import (
	"os"

	"github.com/gofiber/fiber/v3"
)

func KunciApi() fiber.Handler {
	return func(c fiber.Ctx) error {
		kunciValid := os.Getenv("API_KEY")
		if kunciValid == "" {
			kunciValid = "kuncirahasia2026"
		}

		kunciReq := c.Get("X-Api-Key")
		if kunciReq == "" || kunciReq != kunciValid {
			return fiber.NewError(fiber.StatusUnauthorized, "Akses ditolak: Kunci API tidak valid atau tidak disertakan")
		}

		return c.Next()
	}
}
