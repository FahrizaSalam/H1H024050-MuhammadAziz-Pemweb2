import { Navigate } from 'react-router-dom'

/**
 * Komponen Rute Terlindungi (Langkah 9)
 * Memvalidasi keberadaan token sesi sebelum merender komponen anak.
 */
export default function RuteTerlindungi({ children }) {
  const token = sessionStorage.getItem('token')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}
