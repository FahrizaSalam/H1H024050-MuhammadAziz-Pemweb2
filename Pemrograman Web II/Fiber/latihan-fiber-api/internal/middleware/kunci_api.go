package middleware

import (
	"github.com/gofiber/fiber/v3"
)

func KunciApi(kunciYangBenar string) fiber.Handler {
	return func(c fiber.Ctx) error {
		kunciDiterima := c.Get("X-Api-Key")

		if kunciDiterima == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"sukses": false,
				"pesan":  "Header X-Api-Key diperlukan",
			})
		}

		if kunciDiterima != kunciYangBenar {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"sukses": false,
				"pesan":  "Kunci API tidak valid",
			})
		}

		return c.Next()
	}
}
