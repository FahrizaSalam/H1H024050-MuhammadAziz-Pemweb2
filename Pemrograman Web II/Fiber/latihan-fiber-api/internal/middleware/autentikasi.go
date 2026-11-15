package middleware

import (
	"strconv"
	"strings"

	"github.com/gofiber/fiber/v3"

	"latihan-fiber-api/internal/auth"
	"latihan-fiber-api/internal/config"
	"latihan-fiber-api/internal/model"
)

func Autentikasi() fiber.Handler {
	konf := config.Muat()
	return func(c fiber.Ctx) error {
		header := c.Get("Authorization")
		if header == "" {
			return fiber.NewError(fiber.StatusUnauthorized, "Header Authorization tidak ditemukan")
		}

		bagian := strings.Split(header, " ")
		if len(bagian) != 2 || bagian[0] != "Bearer" {
			return fiber.NewError(fiber.StatusUnauthorized, "Format header Authorization tidak sesuai")
		}

		nilaiToken := bagian[1]

		// Periksa apakah token ada di daftar hitam
		var jumlah int64
		config.DB.Model(&model.TokenHitam{}).Where("token = ?", nilaiToken).Count(&jumlah)
		if jumlah > 0 {
			return fiber.NewError(fiber.StatusUnauthorized, "Token telah dicabut")
		}

		klaim, err := auth.PeriksaToken(nilaiToken, konf.JwtSecret)
		if err != nil {
			return fiber.NewError(fiber.StatusUnauthorized, "Token tidak valid atau sudah kedaluwarsa")
		}

		id, err := strconv.ParseUint(klaim.Subject, 10, 64)
		if err != nil {
			return fiber.NewError(fiber.StatusUnauthorized, "Isi token tidak sesuai")
		}

		c.Locals("id_pengguna", uint(id))
		c.Locals("peran", klaim.Peran)
		return c.Next()
	}
}

func HanyaPeran(peranDiizinkan ...string) fiber.Handler {
	return func(c fiber.Ctx) error {
		peran, cocok := c.Locals("peran").(string)
		if cocok == false {
			return fiber.NewError(fiber.StatusForbidden, "Peran pengguna tidak diketahui")
		}

		for _, p := range peranDiizinkan {
			if p == peran {
				return c.Next()
			}
		}

		return fiber.NewError(fiber.StatusForbidden, "Anda tidak berwenang mengakses sumber daya ini")
	}
}
