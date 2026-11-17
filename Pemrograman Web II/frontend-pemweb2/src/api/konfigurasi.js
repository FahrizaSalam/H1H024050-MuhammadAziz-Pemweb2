/**
 * Konfigurasi Backend dan Lapisan Abstraksi (Tugas Praktikum 3)
 * Memungkinkan frontend berpindah antara backend Laravel dan Fiber
 * hanya melalui satu pengaturan (localStorage atau environment variable).
 */

export const BACKEND_LARAVEL = 'laravel'
export const BACKEND_FIBER = 'fiber'

export const DAFTAR_BACKEND = {
  [BACKEND_LARAVEL]: {
    id: BACKEND_LARAVEL,
    label: 'Laravel 13 (PHP)',
    baseURL: import.meta.env.VITE_API_LARAVEL || 'http://127.0.0.1:8000/api',
    authPayloadField: 'password',
    paginationPageField: 'page',
    kunciApiDiperlukan: false,
  },
  [BACKEND_FIBER]: {
    id: BACKEND_FIBER,
    label: 'Fiber v3 (Go)',
    baseURL: import.meta.env.VITE_API_FIBER || 'http://localhost:3000/api',
    authPayloadField: 'kata_sandi',
    paginationPageField: 'halaman',
    kunciApiDiperlukan: true,
  },
}

const KUNCI_STORAGE = 'pemweb2_backend_aktif'

export function ambilBackendAktif() {
  const tersimpan = localStorage.getItem(KUNCI_STORAGE)
  if (tersimpan && DAFTAR_BACKEND[tersimpan]) {
    return tersimpan
  }
  const defaultEnv = import.meta.env.VITE_DEFAULT_BACKEND
  if (defaultEnv && DAFTAR_BACKEND[defaultEnv]) {
    return defaultEnv
  }
  return BACKEND_LARAVEL
}

export function setBackendAktif(namaBackend) {
  if (DAFTAR_BACKEND[namaBackend]) {
    localStorage.setItem(KUNCI_STORAGE, namaBackend)
    // Dispatch custom event agar komponen dapat merefresh data seketika
    window.dispatchEvent(new CustomEvent('backend-changed', { detail: namaBackend }))
    return true
  }
  return false
}

export function ambilInfoBackendAktif() {
  const kunci = ambilBackendAktif()
  return DAFTAR_BACKEND[kunci]
}

export function ambilBaseURL() {
  return ambilInfoBackendAktif().baseURL
}
