import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Navbar from './komponen/Navbar'
import Login from './halaman/Login'
import DaftarMahasiswa from './halaman/DaftarMahasiswa'
import TambahMahasiswa from './halaman/TambahMahasiswa'
import RuteTerlindungi from './komponen/RuteTerlindungi'

/**
 * Komponen Utama Aplikasi (Langkah 9 & Tugas 1, 2, 3)
 */
export default function App() {
  return (
    <BrowserRouter>
      <div style={styles.appContainer}>
        <Navbar />
        <main style={styles.mainContent}>
          <Routes>
            <Route path="/" element={<Navigate to="/mahasiswa" replace />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/mahasiswa"
              element={
                <RuteTerlindungi>
                  <DaftarMahasiswa />
                </RuteTerlindungi>
              }
            />
            <Route
              path="/mahasiswa/tambah"
              element={
                <RuteTerlindungi>
                  <TambahMahasiswa />
                </RuteTerlindungi>
              }
            />
            <Route path="*" element={<Navigate to="/mahasiswa" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

const styles = {
  appContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f8fafc',
    color: '#0f172a',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
  },
  mainContent: {
    flex: 1,
    paddingBottom: 40,
  },
}
