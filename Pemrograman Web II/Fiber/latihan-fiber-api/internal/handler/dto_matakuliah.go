package handler

type PermintaanMatakuliah struct {
	ProgramStudiID uint   `json:"program_studi_id"`
	Kode           string `json:"kode"`
	Nama           string `json:"nama"`
	Sks            int    `json:"sks"`
	Semester       int    `json:"semester"`
}

