import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { simpanMahasiswa, ambilProgramStudi } from '../api/layananMahasiswa'
import { normalisasiGalatValidasi } from '../api/abstraksiAdapter'
import { ambilInfoBackendAktif } from '../api/konfigurasi'

/**
 * Halaman Formulir Tambah Mahasiswa (Tugas Praktikum 1)
 * Menampilkan pesan galat validasi dari server baik secara umum
 * maupun per-bidang input (field-level validation error).
 */
export default function TambahMahasiswa() {
  const [nim, setNim] = useState('')
  const [nama, setNama] = useState('')
  const [email, setEmail] = useState('')
  const [programStudiId, setProgramStudiId] = useState('')
  const [angkatan, setAngkatan] = useState(new Date().getFullYear())
  const [ipk, setIpk] = useState('')
  const [aktif, setAktif] = useState(true)

  const [daftarProdi, setDaftarProdi] = useState([])
  const [pesanGalatUmum, setPesanGalatUmum] = useState('')
  const [galatField, setGalatField] = useState({})
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

  // Muat opsi program studi
  useEffect(() => {
    async function muatProdi() {
      try {
        const prodi = await ambilProgramStudi()
        setDaftarProdi(prodi)
        if (prodi.length > 0) {
          setProgramStudiId(prodi[0].id || prodi[0].ID || 1)
        }
      } catch (err) {
        console.error('Gagal memuat prodi:', err)
      }
    }
    muatProdi()
  }, [])

  async function tanganiKirim(peristiwa) {
    peristiwa.preventDefault()
    setPesanGalatUmum('')
    setGalatField({})
    setSedangMemuat(true)

    const payload = {
      nim: nim.trim(),
      nama: nama.trim(),
      email: email.trim(),
      program_studi_id: Number(programStudiId),
      angkatan: Number(angkatan),
      ipk: ipk !== '' ? parseFloat(ipk) : 0,
      aktif: Boolean(aktif),
    }

    try {
      await simpanMahasiswa(payload)
      // Redirect kembali ke daftar mahasiswa setelah berhasil disimpan
      navigasi('/mahasiswa')
    } catch (galat) {
      // Penanganan galat validasi server (Tugas Praktikum 1)
      const hasilNormalisasi = normalisasiGalatValidasi(galat)
      setPesanGalatUmum(hasilNormalisasi.pesan)
      setGalatField(hasilNormalisasi.errors)
    } finally {
      setSedangMemuat(false)
    }
  }

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h1 style={styles.title}>Tambah Mahasiswa</h1>
        <p style={styles.subtitle}>
          Backend Tujuan: <strong>{infoBackend.label}</strong>
        </p>
      </div>

      {pesanGalatUmum && (
        <div style={styles.alertError}>
          <strong>Gagal Menyimpan Data:</strong> {pesanGalatUmum}
        </div>
      )}

      <form onSubmit={tanganiKirim} style={styles.form}>
        {/* NIM */}
        <div style={styles.formGroup}>
          <label htmlFor="nim" style={styles.label}>
            NIM <span style={styles.required}>*</span>
          </label>
          <input
            id="nim"
            type="text"
            value={nim}
            onChange={(e) => setNim(e.target.value)}
            placeholder="Contoh: H1H024050"
            required
            style={{
              ...styles.input,
              borderColor: galatField.nim ? '#dc2626' : '#cbd5e1',
            }}
          />
          {galatField.nim && (
            <span style={styles.errorText}>{galatField.nim}</span>
          )}
        </div>

        {/* Nama */}
        <div style={styles.formGroup}>
          <label htmlFor="nama" style={styles.label}>
            Nama Lengkap <span style={styles.required}>*</span>
          </label>
          <input
            id="nama"
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Contoh: Muhammad Aziz"
            required
            style={{
              ...styles.input,
              borderColor: galatField.nama ? '#dc2626' : '#cbd5e1',
            }}
          />
          {galatField.nama && (
            <span style={styles.errorText}>{galatField.nama}</span>
          )}
        </div>

        {/* Email */}
        <div style={styles.formGroup}>
          <label htmlFor="email" style={styles.label}>
            Email <span style={styles.required}>*</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Contoh: aziz@unsoed.ac.id"
            required
            style={{
              ...styles.input,
              borderColor: galatField.email ? '#dc2626' : '#cbd5e1',
            }}
          />
          {galatField.email && (
            <span style={styles.errorText}>{galatField.email}</span>
          )}
        </div>

        {/* Program Studi */}
        <div style={styles.formGroup}>
          <label htmlFor="program-studi" style={styles.label}>
            Program Studi <span style={styles.required}>*</span>
          </label>
          <select
            id="program-studi"
            value={programStudiId}
            onChange={(e) => setProgramStudiId(e.target.value)}
            style={{
              ...styles.input,
              borderColor: galatField.program_studi_id ? '#dc2626' : '#cbd5e1',
            }}
          >
            {daftarProdi.map((prodi) => (
              <option key={prodi.id || prodi.ID} value={prodi.id || prodi.ID}>
                {prodi.nama || prodi.Nama} ({prodi.kode || prodi.Kode})
              </option>
            ))}
          </select>
          {galatField.program_studi_id && (
            <span style={styles.errorText}>{galatField.program_studi_id}</span>
          )}
        </div>

        {/* Angkatan & IPK */}
        <div style={styles.row}>
          <div style={{ ...styles.formGroup, flex: 1 }}>
            <label htmlFor="angkatan" style={styles.label}>
              Angkatan <span style={styles.required}>*</span>
            </label>
            <input
              id="angkatan"
              type="number"
              min="2000"
              max="2100"
              value={angkatan}
              onChange={(e) => setAngkatan(e.target.value)}
              required
              style={{
                ...styles.input,
                borderColor: galatField.angkatan ? '#dc2626' : '#cbd5e1',
              }}
            />
            {galatField.angkatan && (
              <span style={styles.errorText}>{galatField.angkatan}</span>
            )}
          </div>

          <div style={{ ...styles.formGroup, flex: 1 }}>
            <label htmlFor="ipk" style={styles.label}>
              IPK (0.00 - 4.00)
            </label>
            <input
              id="ipk"
              type="number"
              step="0.01"
              min="0"
              max="4"
              value={ipk}
              onChange={(e) => setIpk(e.target.value)}
              placeholder="3.85"
              style={{
                ...styles.input,
                borderColor: galatField.ipk ? '#dc2626' : '#cbd5e1',
              }}
            />
            {galatField.ipk && (
              <span style={styles.errorText}>{galatField.ipk}</span>
            )}
          </div>
        </div>

        {/* Checkbox Status Aktif */}
        <div style={styles.checkboxGroup}>
          <input
            id="aktif"
            type="checkbox"
            checked={aktif}
            onChange={(e) => setAktif(e.target.checked)}
            style={styles.checkbox}
          />
          <label htmlFor="aktif" style={styles.checkboxLabel}>
            Status Mahasiswa Aktif
          </label>
        </div>

        {/* Tombol Aksi */}
        <div style={styles.buttonGroup}>
          <Link to="/mahasiswa" style={styles.batalBtn}>
            Batal
          </Link>
          <button
            type="submit"
            disabled={sedangMemuat}
            style={styles.submitBtn}
          >
            {sedangMemuat ? 'Menyimpan...' : 'Simpan Data Mahasiswa'}
          </button>
        </div>
      </form>
    </div>
  )
}

const styles = {
  card: {
    maxWidth: 600,
    margin: '36px auto',
    padding: '32px',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0',
  },
  header: {
    marginBottom: 24,
    borderBottom: '1px solid #f1f5f9',
    paddingBottom: 16,
  },
  title: {
    fontSize: '1.6rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0,
  },
  subtitle: {
    fontSize: '0.875rem',
    color: '#64748b',
    marginTop: 4,
  },
  alertError: {
    padding: '12px 16px',
    backgroundColor: '#fef2f2',
    color: '#b91c1c',
    border: '1px solid #fecaca',
    borderRadius: 8,
    fontSize: '0.875rem',
    marginBottom: 20,
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
  },
  row: {
    display: 'flex',
    gap: 16,
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#334155',
  },
  required: {
    color: '#dc2626',
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
  errorText: {
    fontSize: '0.8rem',
    color: '#dc2626',
    fontWeight: '500',
    marginTop: 2,
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  checkbox: {
    width: 18,
    height: 18,
    cursor: 'pointer',
  },
  checkboxLabel: {
    fontSize: '0.875rem',
    color: '#334155',
    cursor: 'pointer',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
    paddingTop: 16,
    borderTop: '1px solid #f1f5f9',
  },
  batalBtn: {
    padding: '10px 18px',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#475569',
    backgroundColor: '#f1f5f9',
    border: '1px solid #cbd5e1',
    borderRadius: 8,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
  },
  submitBtn: {
    padding: '10px 20px',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#2563eb',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
  },
}
