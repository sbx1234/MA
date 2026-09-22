import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import '../styles/auth.css';

export default function RegisterPage() {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    nombreUsuario: '',
    password: '',
    confirmarPassword: '',
  });
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setExito('');

    if (form.password !== form.confirmarPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (form.nombreUsuario.length < 3) {
      setError('El nombre de usuario debe tener al menos 3 caracteres');
      return;
    }

    setCargando(true);

    try {
      const response = await axiosClient.post('/Auth/registrar', {
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        correo: form.correo.trim().toLowerCase(),
        nombreUsuario: form.nombreUsuario.trim(),
        password: form.password,
      });

      setExito('Cuenta creada. Revisa tu correo para el código de verificación...');

      setTimeout(() => {
        navigate('/verify', {
          state: {
            idUsuario: response.data.idUsuario,
            correo: form.correo.trim().toLowerCase(),
          },
        });
      }, 2000);
    } catch (err) {
      const mensaje =
        err.response?.data?.mensaje ||
        err.response?.data ||
        'Error al registrar usuario';
      setError(typeof mensaje === 'string' ? mensaje : 'Error al registrar');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="etiqueta">Registro</span>
          <h1>Crear Cuenta</h1>
          <p className="subtitulo">Regístrate para comenzar</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="auth-campos-dos">
            <div className="auth-campo">
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                maxLength={100}
                placeholder="Juan"
              />
            </div>

            <div className="auth-campo">
              <label>Apellido</label>
              <input
                type="text"
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                required
                maxLength={100}
                placeholder="Pérez"
              />
            </div>
          </div>

          <div className="auth-campo">
            <label>Correo</label>
            <input
              type="email"
              name="correo"
              value={form.correo}
              onChange={handleChange}
              required
              maxLength={150}
              placeholder="juan@correo.com"
            />
          </div>

          <div className="auth-campo">
            <label>Nombre de Usuario</label>
            <input
              type="text"
              name="nombreUsuario"
              value={form.nombreUsuario}
              onChange={handleChange}
              required
              minLength={3}
              maxLength={50}
              placeholder="juanperez"
            />
          </div>

          <div className="auth-campo">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              maxLength={255}
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div className="auth-campo">
            <label>Confirmar Contraseña</label>
            <input
              type="password"
              name="confirmarPassword"
              value={form.confirmarPassword}
              onChange={handleChange}
              required
              minLength={6}
              maxLength={255}
              placeholder="Repite la contraseña"
            />
          </div>

          {error && <p className="auth-error">{error}</p>}
          {exito && <p className="auth-exito">{exito}</p>}

          <button type="submit" className="auth-btn" disabled={cargando}>
            {cargando ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <p className="auth-link">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}