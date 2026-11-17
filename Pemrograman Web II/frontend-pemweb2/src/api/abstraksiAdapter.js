import { BACKEND_LARAVEL, BACKEND_FIBER, ambilBackendAktif } from './konfigurasi'

/**
 * Lapisan Abstraksi Adaptor (Tugas Praktikum 3)
 * Menjembatani perbedaan kontrak API antara Laravel dan Fiber:
 * 1. Perbedaan nama field request login: password (Laravel) vs kata_sandi (Fiber)
 * 2. Perbedaan parameter paginasi: page (Laravel) vs halaman (Fiber)
 * 3. Perbedaan struktur respons metadata: meta.current_page vs meta.halaman
 * 4. Perbedaan format respons galat validasi server (Tugas Praktikum 1)
 */

export function sesuaikanPayloadLogin(email, kataSandi) {
  const backend = ambilBackendAktif()
  if (backend === BACKEND_FIBER) {
    return {
      email,
      kata_sandi: kataSandi,
    }
  }
  return {
    email,
    password: kataSandi,
  }
}

export function ekstrakDataLogin(responsData) {
  if (!responsData) return null
  const payload = responsData.data || responsData
  return {
    token: payload.token,
    pengguna: payload.pengguna,
  }
}

export function sesuaikanParamDaftar(parameter = {}) {
  const backend = ambilBackendAktif()
  const { page = 1, per_halaman = 10, cari = '', angkatan = '' } = parameter

  if (backend === BACKEND_FIBER) {
    const kueri = {
      halaman: page,
      per_halaman,
    }
    if (cari) kueri.cari = cari
    if (angkatan) kueri.angkatan = angkatan
    return kueri
  }

  // Format Laravel
  const kueri = {
    page,
    per_halaman,
  }
  if (cari) kueri.cari = cari
  if (angkatan) kueri.angkatan = angkatan
  return kueri
}

export function normalisasiDaftarMahasiswa(responsData) {
  if (!responsData) {
    return { data: [], meta: null }
  }

  const backend = ambilBackendAktif()
  const items = Array.isArray(responsData.data) ? responsData.data : []

  // Normalisasi objek item mahasiswa agar konsisten
  const daftarNormal = items.map((mhs) => ({
    id: mhs.id ?? mhs.ID,
    nim: mhs.nim ?? mhs.Nim,
    nama: mhs.nama ?? mhs.Nama,
    email: mhs.email ?? mhs.Email,
    angkatan: mhs.angkatan ?? mhs.Angkatan,
    ipk: mhs.ipk ?? mhs.Ipk,
    aktif: mhs.aktif ?? mhs.Aktif,
    program_studi_id: mhs.program_studi_id ?? mhs.ProgramStudiID,
    program_studi: mhs.program_studi || mhs.ProgramStudi || null,
  }))

  let metaNormal = null

  if (backend === BACKEND_FIBER) {
    const rawMeta = responsData.meta || {}
    metaNormal = {
      current_page: rawMeta.halaman || 1,
      last_page: rawMeta.total_halaman || 1,
      per_page: rawMeta.per_halaman || 10,
      total: rawMeta.total || daftarNormal.length,
    }
  } else {
    // Format Laravel Resource collection pagination
    const rawMeta = responsData.meta || {}
    metaNormal = {
      current_page: rawMeta.current_page || 1,
      last_page: rawMeta.last_page || 1,
      per_page: rawMeta.per_page || 10,
      total: rawMeta.total || daftarNormal.length,
    }
  }

  return {
    data: daftarNormal,
    meta: metaNormal,
  }
}

/**
 * Normalisasi format galat validasi server (Tugas Praktikum 1)
 * Menyatukan format error dari Laravel (422) dan Fiber (422) menjadi struktur seragam:
 * {
 *   pesan: string,
 *   errors: { [field]: string }
 * }
 */
export function normalisasiGalatValidasi(galat) {
  const hasil = {
    pesan: 'Terjadi kesalahan saat validasi data',
    errors: {},
  }

  if (!galat || !galat.response) {
    hasil.pesan = galat?.message || 'Tidak dapat menghubungi server'
    return hasil
  }

  const status = galat.response.status
  const data = galat.response.data || {}

  hasil.pesan = data.pesan || data.message || `Galat HTTP ${status}`

  // Format galat Laravel 422: data.errors = { nim: ['Sudah terdaftar'], ... }
  if (data.errors && typeof data.errors === 'object') {
    for (const [kunci, pesanList] of Object.entries(data.errors)) {
      hasil.errors[kunci] = Array.isArray(pesanList) ? pesanList.join(', ') : String(pesanList)
    }
  }

  // Format galat Fiber 422: data.galat = { nim: '...', ... }
  if (data.galat && typeof data.galat === 'object') {
    for (const [kunci, pesan] of Object.entries(data.galat)) {
      hasil.errors[kunci] = String(pesan)
    }
  }

  return hasil
}
