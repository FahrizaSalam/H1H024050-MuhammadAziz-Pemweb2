import axios from 'axios'
import { ambilBaseURL, ambilInfoBackendAktif } from './konfigurasi'

/**
 * Klien HTTP Axios dengan Interceptor (Langkah 5)
 * Ditingkatkan dengan lapisan abstraksi dinamis (Tugas Praktikum 3)
 */
const klien = axios.create({
  baseURL: ambilBaseURL(),
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Interceptor permintaan: menyisipkan token dan header backend aktif
klien.interceptors.request.use(
  (konfigurasi) => {
    // Sesuaikan baseURL dinamis sesuai backend aktif
    konfigurasi.baseURL = ambilBaseURL()

    // Sisipkan token otorisasi Bearer jika tersedia
    const token = sessionStorage.getItem('token')
    if (token) {
      konfigurasi.headers.Authorization = `Bearer ${token}`
    }

    // Jika target adalah Fiber, sisipkan API Key jika middleware menuntutnya
    const infoBackend = ambilInfoBackendAktif()
    if (infoBackend.kunciApiDiperlukan) {
      konfigurasi.headers['X-Api-Key'] = 'kuncirahasia2026'
    }

    return konfigurasi
  },
  (galat) => Promise.reject(galat)
)

// Interceptor respons: penanganan terpusat galat 401 (token kedaluwarsa/tidak sah)
klien.interceptors.response.use(
  (respons) => respons,
  (galat) => {
    if (galat.response && galat.response.status === 401) {
      // Hapus token dan alihkan ke halaman login
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('pengguna')
      // Hindari redirect berulang jika memang sudah berada di halaman login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(galat)
  }
)

export default klien
