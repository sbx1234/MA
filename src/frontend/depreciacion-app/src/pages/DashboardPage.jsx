import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

export default function DashboardPage() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [mensajeBackend, setMensajeBackend] = useState('Cargando...');

  useEffect(() => {
    axiosClient
      .get('/auth/protegido')
      .then((res) => setMensajeBackend(res.data))
      .catch(() => setMensajeBackend('No autorizado'));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  let datosUsuario = null;
  try {
    datosUsuario = JSON.parse(localStorage.getItem('usuario') || 'null');
  } catch {
    datosUsuario = null;
  }

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>
            Bienvenido, <span className="nombre">{datosUsuario?.nombre || usuario || 'Usuario'}</span>
          </h1>
          <p style={{ color: '#94a3b8', marginTop: 8, fontSize: 14 }}>
            Panel principal del sistema de depreciación
          </p>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>

      {/* Info del usuario */}
      <div className="dashboard-info" style={{ marginBottom: 32 }}>
        <h2>Información del usuario</h2>

        <div className="info-dato">
          <span>Nombre completo</span>
          <span>
            {datosUsuario?.nombre} {datosUsuario?.apellido}
          </span>
        </div>

        <div className="info-dato">
          <span>Nombre de usuario</span>
          <span>{datosUsuario?.nombreUsuario || usuario}</span>
        </div>

        <div className="info-dato">
          <span>Correo</span>
          <span>{datosUsuario?.correo}</span>
        </div>

        <div className="info-dato">
          <span>Respuesta del backend</span>
          <span>{mensajeBackend}</span>
        </div>
      </div>

      {/* Menú de navegación */}
      <div>
        <h2 style={{ marginBottom: 20, fontSize: 20, fontWeight: 700 }}>
          Módulos del sistema
        </h2>

        <div style={styles.grid}>
          <Link to="/activos" style={styles.card}>
            <div style={styles.icono}>📦</div>
            <h3 style={styles.cardTitulo}>Activos</h3>
            <p style={styles.cardDesc}>
              Registrar, editar y administrar los activos de la empresa
            </p>
            <span style={styles.cardBtn}>Ir a Activos →</span>
          </Link>

                    <Link to="/depreciacion" style={styles.card}>
            <div style={styles.icono}>📊</div>
            <h3 style={styles.cardTitulo}>Depreciación</h3>
            <p style={styles.cardDesc}>
              Calcular la depreciación de los activos por meses
            </p>
            <span style={styles.cardBtn}>Ir a Depreciación →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 20,
  },
  card: {
    background: '#0f172a',
    border: '1px solid rgba(37, 99, 235, 0.25)',
    borderRadius: 16,
    padding: 28,
    textDecoration: 'none',
    color: '#fff',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    display: 'block',
  },
  icono: {
    fontSize: 40,
    marginBottom: 16,
  },
  cardTitulo: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 8,
  },
  cardDesc: {
    color: '#94a3b8',
    fontSize: 13,
    lineHeight: 1.6,
    marginBottom: 20,
  },
  cardBtn: {
    color: '#60a5fa',
    fontWeight: 600,
    fontSize: 13,
  },
};