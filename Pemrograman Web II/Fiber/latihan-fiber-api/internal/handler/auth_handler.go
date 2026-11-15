package handler

import (
	"strings"
	"time"

	"github.com/gofiber/fiber/v3"
	"golang.org/x/crypto/bcrypt"

	"latihan-fiber-api/internal/auth"
	"latihan-fiber-api/internal/config"
	"latihan-fiber-api/internal/model"
	"latihan-fiber-api/internal/validasi"
)

func Registrasi(c fiber.Ctx) error {
	var permintaan PermintaanRegistrasi
	err := c.Bind().Body(&permintaan)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Format body tidak valid")
	}

	galat := validasi.Periksa(permintaan)
	if galat != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"sukses": false,
			"pesan":  "Data yang dikirim tidak valid",
			"galat":  galat,
		})
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(permintaan.KataSandi), bcrypt.DefaultCost)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Gagal memproses kata sandi")
	}

	pengguna := model.Pengguna{
		Nama:      permintaan.Nama,
		Email:     permintaan.Email,
		KataSandi: string(hash),
		Peran:     "mahasiswa",
	}

	err = config.DB.Create(&pengguna).Error
	if err != nil {
		return fiber.NewError(fiber.StatusUnprocessableEntity, "Email sudah terdaftar")
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"sukses": true,
		"pesan":  "Registrasi berhasil",
		"data":   pengguna,
	})
}

func Login(c fiber.Ctx) error {
	var permintaan PermintaanLogin
	err := c.Bind().Body(&permintaan)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Format body tidak valid")
	}

	galat := validasi.Periksa(permintaan)
	if galat != nil {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(fiber.Map{
			"sukses": false,
			"pesan":  "Data yang dikirim tidak valid",
			"galat":  galat,
		})
	}

	var pengguna model.Pengguna
	err = config.DB.Where("email = ?", permintaan.Email).First(&pengguna).Error
	if err != nil {
		return fiber.NewError(fiber.StatusUnauthorized, "Email atau kata sandi tidak sesuai")
	}

	err = bcrypt.CompareHashAndPassword([]byte(pengguna.KataSandi), []byte(permintaan.KataSandi))
	if err != nil {
		return fiber.NewError(fiber.StatusUnauthorized, "Email atau kata sandi tidak sesuai")
	}

	konf := config.Muat()
	token, err := auth.TerbitkanToken(pengguna.ID, pengguna.Peran, konf.JwtSecret, konf.JwtTtlMenit)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Gagal menerbitkan token")
	}

	return c.JSON(fiber.Map{
		"sukses": true,
		"pesan":  "Login berhasil",
		"data": fiber.Map{
			"pengguna": pengguna,
			"token":    token,
			"tipe":     "Bearer",
		},
	})
}

func Profil(c fiber.Ctx) error {
	idPengguna := c.Locals("id_pengguna")

	var pengguna model.Pengguna
	err := config.DB.First(&pengguna, idPengguna).Error
	if err != nil {
		return fiber.NewError(fiber.StatusNotFound, "Pengguna tidak ditemukan")
	}

	return c.JSON(fiber.Map{
		"sukses": true,
		"data":   pengguna,
	})
}

// Segarkan menerbitkan token baru berdasarkan token yang masih berlaku.
// Tugas Praktikum 1: POST /api/auth/segarkan
func Segarkan(c fiber.Ctx) error {
	idPengguna := c.Locals("id_pengguna").(uint)
	peran := c.Locals("peran").(string)

	// Ambil token lama dari header untuk dimasukkan ke daftar hitam
	header := c.Get("Authorization")
	bagian := strings.Split(header, " ")
	tokenLama := bagian[1]

	// Masukkan token lama ke daftar hitam
	konf := config.Muat()
	klaim, _ := auth.PeriksaToken(tokenLama, konf.JwtSecret)

	if klaim != nil && klaim.ExpiresAt != nil {
		daftarHitam := model.TokenHitam{
			Token:     tokenLama,
			ExpiredAt: klaim.ExpiresAt.Time,
		}
		config.DB.Create(&daftarHitam)
	}

	// Terbitkan token baru
	tokenBaru, err := auth.TerbitkanToken(idPengguna, peran, konf.JwtSecret, konf.JwtTtlMenit)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Gagal menerbitkan token baru")
	}

	return c.JSON(fiber.Map{
		"sukses": true,
		"pesan":  "Token berhasil disegarkan",
		"data": fiber.Map{
			"token": tokenBaru,
			"tipe":  "Bearer",
		},
	})
}

// Logout mencabut token dengan memasukkannya ke daftar hitam.
// Tugas Praktikum 3: POST /api/auth/logout
func Logout(c fiber.Ctx) error {
	header := c.Get("Authorization")
	bagian := strings.Split(header, " ")
	nilaiToken := bagian[1]

	konf := config.Muat()
	klaim, _ := auth.PeriksaToken(nilaiToken, konf.JwtSecret)

	expiredAt := time.Now().Add(2 * time.Hour) // default
	if klaim != nil && klaim.ExpiresAt != nil {
		expiredAt = klaim.ExpiresAt.Time
	}

	daftarHitam := model.TokenHitam{
		Token:     nilaiToken,
		ExpiredAt: expiredAt,
	}

	err := config.DB.Create(&daftarHitam).Error
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Gagal mencabut token")
	}

	return c.JSON(fiber.Map{
		"sukses": true,
		"pesan":  "Logout berhasil, token telah dicabut",
	})
}
