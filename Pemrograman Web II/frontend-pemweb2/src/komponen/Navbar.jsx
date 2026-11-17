import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  DAFTAR_BACKEND,
  ambilBackendAktif,
  setBackendAktif,
} from '../api/konfigurasi'
import { logout } from '../api/layananAuth'

export default function Navbar() {
  const [backend, setBackend] = useState(ambilBackendAktif())
  const [sedangLogout, setSedangLogout] = useState(false)
  const token = sessionStorage.getItem('token')
  const navigasi = useNavigate()
  const lokasi = useLocation()

  useEffect(() => {
    function onBackendChanged(e) {
      setBackend(e.detail)
    }
    window.addEventListener('backend-changed', onBackendChanged)
    return () => window.removeEventListener('backend-changed', onBackendChanged)
  }, [])

  function handleGantiBackend(e) {
    const pilihan = e.target.value
    setBackendAktif(pilihan)
    setBackend(pilihan)
  }

  async function handleLogout() {
    setSedangLogout(true)
    try {
      await logout()
    } catch (err) {
      // Jika request gagal (misal server mati), session tetap dibersihkan
    } finally {
      sessionStorage.removeItem('token')
      setSedangLogout(false)
      navigasi('/login')
    }
  }

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <div style={styles.brandGroup}>
          <Link to="/mahasiswa" style={styles.brandTitle}>
            Praktikum Pemweb II - Modul 9
          </Link>
          <span style={styles.badge}>
            Aktif: {DAFTAR_BACKEND[backend]?.label}
          </span>
        </div>

        <nav style={styles.navGroup}>
          {token && (
            <>
              <Link
                to="/mahasiswa"
                style={{
                  ...styles.navLink,
                  fontWeight: lokasi.pathname === '/mahasiswa' ? '700' : '400',
                  borderBottom: lokasi.pathname === '/mahasiswa' ? '2px solid #2563eb' : 'none',
                }}
              >
                Daftar Mahasiswa
              </Link>
              <Link
                to="/mahasiswa/tambah"
                style={{
                  ...styles.navLink,
                  fontWeight: lokasi.pathname === '/mahasiswa/tambah' ? '700' : '400',
                  borderBottom: lokasi.pathname === '/mahasiswa/tambah' ? '2px solid #2563eb' : 'none',
                }}
              >
                + Tambah Mahasiswa
              </Link>
            </>
          )}

          {/* Pengatur Lapisan Abstraksi Backend (Tugas 3) */}
          <div style={styles.switcherContainer}>
            <label htmlFor="backend-select" style={styles.switcherLabel}>
              Backend:
            </label>
            <select
              id="backend-select"
              value={backend}
              onChange={handleGantiBackend}
              style={styles.switcherSelect}
            >
              <option value="laravel">Laravel (Port 8000)</option>
              <option value="fiber">Fiber (Port 3000)</option>
            </select>
          </div>

          {token && (
            <button
              onClick={handleLogout}
              disabled={sedangLogout}
              style={styles.logoutButton}
            >
              {sedangLogout ? 'Keluar...' : 'Keluar'}
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}

const styles = {
  header: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    padding: '12px 24px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  container: {
    maxWidth: 1100,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  brandGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  brandTitle: {
    fontSize: '1.15rem',
    fontWeight: '700',
    color: '#0f172a',
    textDecoration: 'none',
  },
  badge: {
    fontSize: '0.75rem',
    fontWeight: '600',
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
    padding: '3px 8px',
    borderRadius: 6,
    border: '1px solid #bfdbfe',
  },
  navGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  navLink: {
    fontSize: '0.9rem',
    color: '#334155',
    textDecoration: 'none',
    padding: '6px 4px',
  },
  switcherContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: '0.85rem',
    color: '#475569',
  },
  switcherLabel: {
    fontWeight: '600',
  },
  switcherSelect: {
    padding: '4px 8px',
    fontSize: '0.85rem',
    borderRadius: 6,
    border: '1px solid #cbd5e1',
    backgroundColor: '#f8fafc',
    color: '#0f172a',
    cursor: 'pointer',
  },
  logoutButton: {
    padding: '6px 14px',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#dc2626',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: 6,
    cursor: 'pointer',
  },
}
