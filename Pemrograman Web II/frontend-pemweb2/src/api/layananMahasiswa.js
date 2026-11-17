import klien from './klien'
import {
  sesuaikanParamDaftar,
  normalisasiDaftarMahasiswa,
} from './abstraksiAdapter'

/**
 * Layanan Data Mahasiswa (Langkah 6 & Tugas Praktikum 1, 2, 3)
 */

export async function ambilDaftarMahasiswa(parameter = {}) {
  const params = sesuaikanParamDaftar(parameter)
  const respons = await klien.get('/mahasiswa', { params })
  return normalisasiDaftarMahasiswa(respons.data)
}

export async function ambilDetailMahasiswa(id) {
  const respons = await klien.get(`/mahasiswa/${id}`)
  return respons.data
}

export async function simpanMahasiswa(data) {
  const respons = await klien.post('/mahasiswa', data)
  return respons.data
}

export async function hapusMahasiswa(id) {
  const respons = await klien.delete(`/mahasiswa/${id}`)
  return respons.data
}

export async function ambilProgramStudi() {
  try {
    const respons = await klien.get('/program-studi')
    const list = respons.data?.data || respons.data || []
    return list
  } catch (err) {
    // Fallback jika rute program-studi berbeda pada backend
    return [
      { id: 1, kode: 'TK', nama: 'Teknik Komputer' },
      { id: 2, kode: 'IF', nama: 'Informatika' },
      { id: 3, kode: 'TE', nama: 'Teknik Elektro' },
    ]
  }
}
