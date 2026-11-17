import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/layananAuth'
import { ambilInfoBackendAktif } from '../api/konfigurasi'

/**
 * Halaman Login (Langkah 7)
 * Terintegrasi dengan Lapisan Abstraksi (Tugas 3)
 */
export default function Login() {
  const [email, setEmail] = useState('')
  const [kataSandi, setKataSandi] = useState('')
  const [pesanGalat, setPesanGalat] = useState('')
  const [sedangMemuat, setSedangMemuat] = useState(false)
  const [infoBackend, setInfoBackend] = useState(ambilInfoBackendAktif())
  const navigasi = useNavigate()

  useEffect(() => {
    function onBackendChanged() {
      setInfoBackend(ambilInfoBackendAktif())
    }
    window.addEventListener('backend-changed', onBackendChanged)
    return () => window.removeEventListener('backend-changed', onBackendChanged)
  }, [])

  async function tanganiKirim(peristiwa) {
    peristiwa.preventDefault()
    setPesanGalat('')
    setSedangMemuat(true)

    try {
      const hasil = await login(email, kataSandi)
      if (hasil?.data?.token) {
        sessionStorage.setItem('token', hasil.data.token)
        if (hasil.data.pengguna) {
          sessionStorage.setItem('pengguna', JSON.stringify(hasil.data.pengguna))
        }
        navigasi('/mahasiswa')
      } else {
        setPesanGalat('Respon server tidak memuat token otorisasi')
      }
    } catch (galat) {
      if (galat.response) {
        const pesan =
          galat.response.data?.pesan ||
          galat.response.data?.message ||
          'Email atau kata sandi tidak sesuai'
        setPesanGalat(pesan)
      } else {
        setPesanGalat('Tidak dapat menghubungi server. Pastikan backend aktif.')
      }
    } finally {
      setSedangMemuat(false)
    }
  }

  return (
    <div style={styles.card}>
      <h1 style={styles.title}>Masuk</h1>
      <p style={styles.subtitle}>
        Target Backend: <strong>{infoBackend.label}</strong> ({infoBackend.baseURL})
      </p>

      {pesanGalat && <div style={styles.alertError}>{pesanGalat}</div>}

      <form onSubmit={tanganiKirim} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="email" style={styles.label}>
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(peristiwa) => setEmail(peristiwa.target.value)}
            placeholder="nama@email.com"
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="kata-sandi" style={styles.label}>
            Kata Sandi
          </label>
          <input
            id="kata-sandi"
            type="password"
            value={kataSandi}
            onChange={(peristiwa) => setKataSandi(peristiwa.target.value)}
            placeholder="••••••••"
            required
            style={styles.input}
          />
        </div>

        <button type="submit" disabled={sedangMemuat} style={styles.submitBtn}>
          {sedangMemuat ? 'Memproses...' : 'Masuk'}
        </button>
      </form>
    </div>
  )
}

const styles = {
  card: {
    maxWidth: 400,
    margin: '60px auto',
    padding: '32px 28px',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0',
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '0.85rem',
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
  },
  alertError: {
    padding: '10px 14px',
    backgroundColor: '#fef2f2',
    color: '#b91c1c',
    border: '1px solid #fecaca',
    borderRadius: 8,
    fontSize: '0.875rem',
    marginBottom: 16,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    textAlign: 'left',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#334155',
  },
  input: {
    padding: '10px 12px',
    fontSize: '0.95rem',
    borderRadius: 8,
    border: '1px solid #cbd5e1',
    outline: 'none',
    boxSizing: 'border-box',
    width: '100%',
  },
  submitBtn: {
    marginTop: 8,
    padding: '11px',
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#2563eb',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
}
