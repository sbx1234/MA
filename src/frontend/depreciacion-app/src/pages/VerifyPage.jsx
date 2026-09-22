import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import '../styles/auth.css';

export default function VerifyPage() {
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const idUsuario = location.state?.idUsuario;
  const correo = location.state?.correo;

  if (!idUsuario) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Error</h1>
            <p className="subtitulo">No se encontró información de registro.</p>
          </div>
          <Link to="/register" className="auth-btn" style={{ textDecoration: 'none' }}>
            Volver al registro
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');
    setCargando(true);

    try {
      await axiosClient.post('/Auth/verificar', {
        idUsuario,
        codigo: codigo.trim(),
      });

      setExito('Cuenta verificada. Redirigiendo al login...');

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const mensaje =
        err.response?.data?.mensaje ||
        err.response?.data ||
        'Error al verificar';
      setError(typeof mensaje === 'string' ? mensaje : 'Error al verificar');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="etiqueta">Verificación</span>
          <h1>Verificar Correo</h1>
        </div>

        <div className="auth-codigo-info">
          <p>Hemos enviado un código de 6 dígitos a:</p>
          <p className="correo">{correo}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="auth-campo">
            <label>Código de verificación</label>
            <input
              type="text"
              className="auth-codigo-input"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))}
              required
              maxLength={6}
              minLength={6}
              placeholder="000000"
            />
          </div>

          {error && <p className="auth-error">{error}</p>}
          {exito && <p className="auth-exito">{exito}</p>}

          <button
            type="submit"
            className="auth-btn"
            disabled={cargando || codigo.length !== 6}
          >
            {cargando ? 'Verificando...' : 'Verificar'}
          </button>
        </form>

        <p className="auth-link">
          ¿No recibiste el código?{' '}
          <Link to="/register">Volver a registrarte</Link>
        </p>
      </div>
    </div>
  );
}