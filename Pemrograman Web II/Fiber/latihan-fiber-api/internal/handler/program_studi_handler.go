package handler

import (
	"latihan-fiber-api/internal/config"
	"latihan-fiber-api/internal/model"

	"github.com/gofiber/fiber/v3"
)

func DaftarProgramStudi(c fiber.Ctx) error {
	type ProgramStudiDenganJumlah struct {
		model.ProgramStudi
		JumlahMahasiswa int64 `json:"jumlah_mahasiswa"`
	}

	var daftarProdi []model.ProgramStudi

	err := config.DB.Find(&daftarProdi).Error
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Gagal mengambil data program studi")
	}

	var hasil []ProgramStudiDenganJumlah

	for _, prodi := range daftarProdi {
		var jumlah int64
		config.DB.Model(&model.Mahasiswa{}).Where("program_studi_id = ?", prodi.ID).Count(&jumlah)

		hasil = append(hasil, ProgramStudiDenganJumlah{
			ProgramStudi:    prodi,
			JumlahMahasiswa: jumlah,
		})
	}

	return c.JSON(fiber.Map{
		"sukses": true,
		"data":   hasil,
	})
}

