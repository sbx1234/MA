import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import RegisterPage from './pages/RegisterPage';
import VerifyPage from './pages/VerifyPage';
import DashboardPage from './pages/DashboardPage';
import Activos from './pages/Activos';
import Depreciacion from './pages/Depreciacion';
import ResultadoDepreciacion from './pages/ResultadoDepreciacion';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify" element={<VerifyPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/activos"
            element={
              <ProtectedRoute>
                <Activos />
              </ProtectedRoute>
            }
          />

          <Route
            path="/depreciacion"
            element={
              <ProtectedRoute>
                <Depreciacion />
              </ProtectedRoute>
            }
          />

          <Route
            path="/depreciacion/resultado"
            element={
              <ProtectedRoute>
                <ResultadoDepreciacion />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}