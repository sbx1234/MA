import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

export default function Depreciacion() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activos, setActivos] = useState([]);
  const [activoSeleccionado, setActivoSeleccionado] = useState(null);
  const [meses, setMeses] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarActivos();
  }, []);

  const cargarActivos = async () => {
    try {
      const res = await axiosClient.get('/activos');
      setActivos(res.data);
    } catch {
      setError('Error al cargar activos');
    }
  };

  const seleccionarActivo = (idActivo) => {
    const activo = activos.find((a) => a.idActivo === Number(idActivo));
    setActivoSeleccionado(activo || null);
  };

  const calcular = async (e) => {
    e.preventDefault();
    setError('');

    if (!activoSeleccionado) {
      setError('Selecciona un activo');
      return;
    }
    if (!meses || Number(meses) < 1) {
      setError('Ingresa una cantidad de meses válida');
      return;
    }

    setCargando(true);

    try {
      const res = await axiosClient.post('/depreciacion/calcular', {
        idActivo: activoSeleccionado.idActivo,
        meses: Number(meses),
      });

      navigate('/depreciacion/resultado', {
        state: { resultado: res.data },
      });
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al calcular');
    } finally {
      setCargando(false);
    }
  };

  const formatoMoneda = (v) =>
    Number(v).toLocaleString('es-EC', { style: 'currency', currency: 'USD' });

  const formatoFecha = (f) => new Date(f).toLocaleDateString('es-EC');

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>
            Cálculo de <span className="nombre">Depreciación</span>
          </h1>
          <p style={{ color: '#94a3b8', marginTop: 8, fontSize: 14 }}>
            Método de línea recta por meses
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/dashboard" className="btn-logout" style={{ textDecoration: 'none' }}>
            ← Dashboard
          </Link>
          <button className="btn-logout" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>

      <div style={cardStyle}>
        <h2 style={{ marginBottom: 16, fontSize: 20, fontWeight: 700 }}>
          ¿Cómo funciona?
        </h2>
        <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
          La depreciación se calcula por el método de <strong style={{ color: '#60a5fa' }}>línea recta</strong>.
          El sistema usa el valor de compra, la vida útil (según la categoría del activo) y el valor residual (10%).
          Tú solo necesitas ingresar <strong style={{ color: '#60a5fa' }}>cuántos meses</strong> quieres depreciar.
        </p>
        <div style={formulaBox}>
          <p style={{ fontSize: 13, color: '#cbd5e1', marginBottom: 8 }}>
            <strong style={{ color: '#60a5fa' }}>Fórmulas:</strong>
          </p>
          <p style={formulaItem}>Valor residual = Valor compra × 10%</p>
          <p style={formulaItem}>Valor depreciable = Valor compra − Valor residual</p>
          <p style={formulaItem}>Depreciación anual = Valor depreciable ÷ Vida útil (años)</p>
          <p style={formulaItem}>Depreciación mensual = Depreciación anual ÷ 12</p>
          <p style={formulaItem}>Depreciación período = Depreciación mensual × Meses</p>
        </div>
      </div>

      <div style={{ ...cardStyle, marginTop: 24 }}>
        <h2 style={{ marginBottom: 24, fontSize: 20, fontWeight: 700 }}>
          Calcular Depreciación
        </h2>

        <form onSubmit={calcular}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
            <div className="auth-campo">
              <label>Activo a depreciar</label>
              <select
                value={activoSeleccionado?.idActivo || ''}
                onChange={(e) => seleccionarActivo(e.target.value)}
                required
                style={selectStyle}
              >
                <option value="">Seleccionar activo</option>
                {activos.map((a) => (
                  <option key={a.idActivo} value={a.idActivo}>
                    #{a.idActivo} - {a.descripcion} ({a.nombreTipo})
                  </option>
                ))}
              </select>
            </div>

            <div className="auth-campo">
              <label>Meses a depreciar</label>
              <input
                type="number"
                value={meses}
                onChange={(e) => setMeses(e.target.value)}
                min="1"
                max="240"
                required
                placeholder="Ej: 8"
              />
            </div>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button
            type="submit"
            className="auth-btn"
            disabled={cargando}
            style={{ maxWidth: 300 }}
          >
            {cargando ? 'Calculando...' : 'Calcular Depreciación'}
          </button>
        </form>
      </div>

      {activoSeleccionado && (
        <div style={{ ...cardStyle, marginTop: 24 }}>
          <h2 style={{ marginBottom: 20, fontSize: 18, fontWeight: 700 }}>
            Datos del Activo Seleccionado
          </h2>

          <div style={infoGridStyle}>
            <InfoItem label="Descripción" value={activoSeleccionado.descripcion} />
            <InfoItem label="Tipo" value={activoSeleccionado.nombreTipo} />
            <InfoItem label="Categoría" value={activoSeleccionado.nombreCategoria} />
            <InfoItem label="Vida útil" value={`${activoSeleccionado.vidaUtilAnios} años`} />
            <InfoItem label="% Residual" value={`${activoSeleccionado.porcentajeValorResidual}%`} />
            <InfoItem label="Fecha compra" value={formatoFecha(activoSeleccionado.fechaCompra)} />
            <InfoItem label="Valor compra" value={formatoMoneda(activoSeleccionado.valorCompra)} highlight />
          </div>
        </div>
      )}
    </div>
  );
}

function InfoItem({ label, value, highlight }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.2, color: '#60a5fa', fontWeight: 700 }}>
        {label}
      </span>
      <span style={{ color: highlight ? '#4ade80' : '#fff', fontSize: 14, fontWeight: highlight ? 700 : 500 }}>
        {value}
      </span>
    </div>
  );
}

const cardStyle = {
  background: '#0f172a',
  border: '1px solid rgba(37, 99, 235, 0.25)',
  borderRadius: 16,
  padding: 32,
};

const selectStyle = {
  background: '#0a0f1c',
  border: '1px solid rgba(37, 99, 235, 0.25)',
  color: '#fff',
  padding: '12px 16px',
  borderRadius: 10,
  fontSize: 14,
  fontFamily: 'Poppins, sans-serif',
  outline: 'none',
  width: '100%',
  cursor: 'pointer',
};

const infoGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: 20,
};

const formulaBox = {
  background: 'rgba(10, 15, 28, 0.6)',
  border: '1px solid rgba(37, 99, 235, 0.15)',
  borderRadius: 12,
  padding: 20,
};

const formulaItem = {
  fontSize: 12,
  color: '#94a3b8',
  fontFamily: 'monospace',
  marginBottom: 4,
};