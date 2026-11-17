import klien from './klien'
import { sesuaikanPayloadLogin, ekstrakDataLogin } from './abstraksiAdapter'

/**
 * Layanan Autentikasi (Langkah 6 & Tugas 3)
 */

export async function login(email, kataSandi) {
  const payload = sesuaikanPayloadLogin(email, kataSandi)
  const respons = await klien.post('/auth/login', payload)
  return {
    raw: respons.data,
    data: ekstrakDataLogin(respons.data),
  }
}

export async function ambilProfil() {
  const respons = await klien.get('/auth/profil')
  return respons.data
}

export async function logout() {
  try {
    const respons = await klien.post('/auth/logout')
    return respons.data
  } finally {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('pengguna')
  }
}
