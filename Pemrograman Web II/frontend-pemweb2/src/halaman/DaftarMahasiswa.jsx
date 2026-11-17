import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ambilDaftarMahasiswa, hapusMahasiswa } from '../api/layananMahasiswa'
import { ambilInfoBackendAktif } from '../api/konfigurasi'

/**
 * Halaman Daftar Mahasiswa (Langkah 8)
 * Dilengkapi Tombol Hapus dengan Dialog Konfirmasi & Pembaruan Otomatis (Tugas 2)
 */
export default function DaftarMahasiswa() {
  const [daftar, setDaftar] = useState([])
  const [meta, setMeta] = useState(null)
  const [halaman, setHalaman] = useState(1)
  const [cari, setCari] = useState('')
  const [sedangMemuat, setSedangMemuat] = useState(false)
  const [pesanGalat, setPesanGalat] = useState('')
  const [pesanSukses, setPesanSukses] = useState('')
  const [idSedangDihapus, setIdSedangDihapus] = useState(null)
  const [infoBackend, setInfoBackend] = useState(ambilInfoBackendAktif())

  // Muat data mahasiswa
  const muatData = useCallback(async (halamanTuju, kataKunci) => {
    setSedangMemuat(true)
    setPesanGalat('')
    try {
      const hasil = await ambilDaftarMahasiswa({
        page: halamanTuju,
        cari: kataKunci,
        per_halaman: 10,
      })
      setDaftar(hasil.data || [])
      setMeta(hasil.meta || null)
    } catch (galat) {
      const pesan =
        galat.response?.data?.pesan ||
        galat.response?.data?.message ||
        'Gagal memuat data mahasiswa'
      setPesanGalat(pesan)
    } finally {
      setSedangMemuat(false)
    }
  }, [])

  // Debounce 400ms pencarian (Langkah 8)
  useEffect(() => {
    let dibatalkan = false

    const penunda = setTimeout(() => {
      if (!dibatalkan) {
        muatData(halaman, cari)
      }
    }, 400)

    return () => {
      dibatalkan = true
      clearTimeout(penunda)
    }
  }, [halaman, cari, muatData])

  // Dengarkan event perubahan backend (Tugas 3)
  useEffect(() => {
    function onBackendChanged() {
      setInfoBackend(ambilInfoBackendAktif())
      setHalaman(1)
      muatData(1, cari)
    }
    window.addEventListener('backend-changed', onBackendChanged)
    return () => window.removeEventListener('backend-changed', onBackendChanged)
  }, [cari, muatData])

  // Penanganan Hapus Mahasiswa dengan Konfirmasi (Tugas Praktikum 2)
  async function tanganiHapus(mahasiswa) {
    const konfirmasi = window.confirm(
      `Apakah Anda yakin ingin menghapus mahasiswa:\nNama: ${mahasiswa.nama}\nNIM: ${mahasiswa.nim}?`
    )

    if (!konfirmasi) return

    setIdSedangDihapus(mahasiswa.id)
    setPesanGalat('')
    setPesanSukses('')

    try {
      await hapusMahasiswa(mahasiswa.id)
      setPesanSukses(`Mahasiswa "${mahasiswa.nama}" (${mahasiswa.nim}) berhasil dihapus.`)
      // Perbarui daftar data secara otomatis (Tugas Praktikum 2)
      await muatData(halaman, cari)
    } catch (galat) {
      const pesan =
        galat.response?.data?.pesan ||
        galat.response?.data?.message ||
        'Gagal menghapus data mahasiswa (pastikan peran Anda adalah admin)'
      setPesanGalat(pesan)
    } finally {
      setIdSedangDihapus(null)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.title}>Daftar Mahasiswa</h1>
          <p style={styles.subtitle}>
            Terhubung ke: <strong>{infoBackend.label}</strong> ({infoBackend.baseURL})
          </p>
        </div>
        <Link to="/mahasiswa/tambah" style={styles.tambahBtn}>
          + Tambah Mahasiswa
        </Link>
      </div>

      {pesanSukses && <div style={styles.alertSuccess}>{pesanSukses}</div>}
      {pesanGalat && <div style={styles.alertError}>{pesanGalat}</div>}

      <div style={styles.searchBar}>
        <input
          type="search"
          placeholder="Cari nama atau NIM..."
          value={cari}
          onChange={(peristiwa) => {
            setHalaman(1)
            setCari(peristiwa.target.value)
          }}
          style={styles.searchInput}
        />
        {cari && (
          <button onClick={() => setCari('')} style={styles.clearSearchBtn}>
            Reset
          </button>
        )}
      </div>

      {sedangMemuat && (
        <div style={styles.loadingBox}>
          <span style={styles.spinner}></span> Memuat data mahasiswa...
        </div>
      )}

      {!sedangMemuat && daftar.length === 0 && (
        <div style={styles.emptyBox}>
          <p>Tidak ada data mahasiswa ditemukan.</p>
        </div>
      )}

      {daftar.length > 0 && (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>NIM</th>
                <th style={styles.th}>Nama</th>
                <th style={styles.th}>Program Studi</th>
                <th style={styles.th}>Angkatan</th>
                <th style={styles.th}>IPK</th>
                <th style={styles.thAksi}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {daftar.map((mahasiswa) => (
                <tr key={mahasiswa.id} style={styles.tr}>
                  <td style={styles.tdBold}>{mahasiswa.nim}</td>
                  <td style={styles.td}>{mahasiswa.nama}</td>
                  <td style={styles.td}>
                    {mahasiswa.program_studi?.nama || '-'}
                  </td>
                  <td style={styles.td}>{mahasiswa.angkatan}</td>
                  <td style={styles.td}>
                    <span style={styles.ipkBadge}>
                      {Number(mahasiswa.ipk).toFixed(2)}
                    </span>
                  </td>
                  <td style={styles.tdAksi}>
                    {/* Tombol Hapus dengan Dialog Konfirmasi (Tugas Praktikum 2) */}
                    <button
                      onClick={() => tanganiHapus(mahasiswa)}
                      disabled={idSedangDihapus === mahasiswa.id}
                      style={styles.hapusBtn}
                      title="Hapus data mahasiswa"
                    >
                      {idSedangDihapus === mahasiswa.id ? 'Menghapus...' : 'Hapus'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Kontrol Paginasi (Langkah 8 & Langkah 10) */}
      {meta && (
        <div style={styles.paginationWrapper}>
          <button
            onClick={() => setHalaman((prev) => Math.max(prev - 1, 1))}
            disabled={halaman <= 1 || sedangMemuat}
            style={styles.pageBtn}
          >
            ← Sebelumnya
          </button>
          <span style={styles.pageInfo}>
            Halaman <strong>{meta.current_page}</strong> dari <strong>{meta.last_page}</strong> (Total: {meta.total} data)
          </span>
          <button
            onClick={() => setHalaman((prev) => prev + 1)}
            disabled={halaman >= meta.last_page || sedangMemuat}
            style={styles.pageBtn}
          >
            Berikutnya →
          </button>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    maxWidth: 960,
    margin: '32px auto',
    padding: '0 20px',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 16,
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0,
  },
  subtitle: {
    fontSize: '0.875rem',
    color: '#64748b',
    marginTop: 4,
  },
  tambahBtn: {
    padding: '10px 18px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    textDecoration: 'none',
    fontWeight: '600',
    borderRadius: 8,
    fontSize: '0.9rem',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  alertSuccess: {
    padding: '12px 16px',
    backgroundColor: '#f0fdf4',
    color: '#15803d',
    border: '1px solid #bbf7d0',
    borderRadius: 8,
    marginBottom: 16,
    fontSize: '0.875rem',
  },
  alertError: {
    padding: '12px 16px',
    backgroundColor: '#fef2f2',
    color: '#b91c1c',
    border: '1px solid #fecaca',
    borderRadius: 8,
    marginBottom: 16,
    fontSize: '0.875rem',
  },
  searchBar: {
    display: 'flex',
    gap: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    padding: '10px 14px',
    fontSize: '0.95rem',
    border: '1px solid #cbd5e1',
    borderRadius: 8,
    outline: 'none',
    backgroundColor: '#ffffff',
  },
  clearSearchBtn: {
    padding: '10px 16px',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    border: '1px solid #cbd5e1',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: '0.875rem',
  },
  loadingBox: {
    padding: 24,
    textAlign: 'center',
    color: '#475569',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    marginBottom: 16,
  },
  emptyBox: {
    padding: 32,
    textAlign: 'center',
    color: '#64748b',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    border: '1px dashed #cbd5e1',
  },
  tableWrapper: {
    overflowX: 'auto',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  thRow: {
    backgroundColor: '#f8fafc',
    borderBottom: '2px solid #e2e8f0',
  },
  th: {
    padding: '12px 16px',
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  thAksi: {
    padding: '12px 16px',
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  tr: {
    borderBottom: '1px solid #f1f5f9',
  },
  td: {
    padding: '12px 16px',
    fontSize: '0.9rem',
    color: '#334155',
  },
  tdBold: {
    padding: '12px 16px',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#0f172a',
  },
  tdAksi: {
    padding: '12px 16px',
    textAlign: 'center',
  },
  ipkBadge: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 6,
    fontSize: '0.85rem',
    fontWeight: '600',
    backgroundColor: '#f0fdf4',
    color: '#166534',
    border: '1px solid #bbf7d0',
  },
  hapusBtn: {
    padding: '6px 12px',
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#dc2626',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: 6,
    cursor: 'pointer',
    transition: 'all 0.15s ease-in-out',
  },
  paginationWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginTop: 24,
  },
  pageBtn: {
    padding: '8px 16px',
    fontSize: '0.875rem',
    fontWeight: '600',
    backgroundColor: '#ffffff',
    color: '#1e293b',
    border: '1px solid #cbd5e1',
    borderRadius: 6,
    cursor: 'pointer',
  },
  pageInfo: {
    fontSize: '0.875rem',
    color: '#475569',
  },
}
