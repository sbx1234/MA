import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

export default function Activos() {
  const { usuario, logout } = useAuth();
  const [activos, setActivos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');

  // Formulario
  const [form, setForm] = useState({
    descripcion: '',
    idTipo: '',
    fechaCompra: '',
    valorCompra: '',
  });
  const [editandoId, setEditandoId] = useState(null);

  // Cargar datos
  useEffect(() => {
    cargarTodo();
  }, []);

  const cargarTodo = async () => {
    try {
      setCargando(true);
      const [resActivos, resTipos, resCategorias] = await Promise.all([
        axiosClient.get('/activos'),
        axiosClient.get('/activos/tipos'),
        axiosClient.get('/activos/categorias'),
      ]);
      setActivos(resActivos.data);
      setTipos(resTipos.data);
      setCategorias(resCategorias.data);
    } catch (err) {
      mostrarMensaje('Error al cargar datos', 'error');
    } finally {
      setCargando(false);
    }
  };

  const mostrarMensaje = (texto, tipo = 'exito') => {
    setMensaje(texto);
    setTipoMensaje(tipo);
    setTimeout(() => setMensaje(''), 4000);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const datos = {
      descripcion: form.descripcion.trim(),
      idTipo: Number(form.idTipo),
      fechaCompra: form.fechaCompra,
      valorCompra: Number(form.valorCompra),
    };

    try {
      if (editandoId) {
        await axiosClient.put(`/activos/${editandoId}`, datos);
        mostrarMensaje('Activo actualizado correctamente', 'exito');
      } else {
        await axiosClient.post('/activos', datos);
        mostrarMensaje('Activo registrado correctamente', 'exito');
      }
      limpiarFormulario();
      cargarTodo();
    } catch (err) {
      const msg = err.response?.data?.mensaje || 'Error al guardar';
      mostrarMensaje(msg, 'error');
    }
  };

  const editarActivo = (activo) => {
    setForm({
      descripcion: activo.descripcion,
      idTipo: activo.idTipo,
      fechaCompra: activo.fechaCompra.substring(0, 10),
      valorCompra: activo.valorCompra,
    });
    setEditandoId(activo.idActivo);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const eliminarActivo = async (id) => {
    if (!window.confirm('¿Eliminar este activo?')) return;

    try {
      await axiosClient.delete(`/activos/${id}`);
      mostrarMensaje('Activo eliminado', 'exito');
      cargarTodo();
    } catch (err) {
      mostrarMensaje('Error al eliminar', 'error');
    }
  };

  const limpiarFormulario = () => {
    setForm({
      descripcion: '',
      idTipo: '',
      fechaCompra: '',
      valorCompra: '',
    });
    setEditandoId(null);
  };

  const formatoFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-EC');
  };

  const formatoMoneda = (valor) => {
    return Number(valor).toLocaleString('es-EC', {
      style: 'currency',
      currency: 'USD',
    });
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>
            Gestión de <span className="nombre">Activos</span>
          </h1>
          <p style={{ color: '#94a3b8', marginTop: 8, fontSize: 14 }}>
            Registra, edita y elimina los activos de la empresa
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

      {/* Formulario */}
      <div
        style={{
          background: '#0f172a',
          border: '1px solid rgba(37, 99, 235, 0.25)',
          borderRadius: 16,
          padding: 32,
          marginBottom: 32,
        }}
      >
        <h2 style={{ marginBottom: 24, fontSize: 20, fontWeight: 700 }}>
          {editandoId ? 'Editar Activo' : 'Registrar Nuevo Activo'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
            <div className="auth-campo">
              <label>Descripción</label>
              <input
                type="text"
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                required
                maxLength={200}
                placeholder="Ej: Laptop Lenovo ThinkPad"
              />
            </div>

            <div className="auth-campo">
              <label>Tipo de Activo</label>
              <select
                name="idTipo"
                value={form.idTipo}
                onChange={handleChange}
                required
                style={{
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
                }}
              >
                <option value="">Seleccionar tipo</option>
                {tipos.map((t) => (
                  <option key={t.idTipo} value={t.idTipo}>
                    {t.nombreTipo}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="auth-campo">
              <label>Fecha de Compra</label>
              <input
                type="date"
                name="fechaCompra"
                value={form.fechaCompra}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-campo">
              <label>Valor de Compra (USD)</label>
              <input
                type="number"
                name="valorCompra"
                value={form.valorCompra}
                onChange={handleChange}
                required
                min="0.01"
                step="0.01"
                placeholder="0.00"
              />
            </div>
          </div>

          {mensaje && (
            <p className={tipoMensaje === 'error' ? 'auth-error' : 'auth-exito'}>
              {mensaje}
            </p>
          )}

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="submit" className="auth-btn" style={{ maxWidth: 250 }}>
              {editandoId ? 'Actualizar Activo' : 'Registrar Activo'}
            </button>
            {editandoId && (
              <button
                type="button"
                className="btn-logout"
                onClick={limpiarFormulario}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Tabla de activos */}
      <div
        style={{
          background: '#0f172a',
          border: '1px solid rgba(37, 99, 235, 0.25)',
          borderRadius: 16,
          padding: 32,
        }}
      >
        <h2 style={{ marginBottom: 20, fontSize: 20, fontWeight: 700 }}>
          Activos Registrados ({activos.length})
        </h2>

        {cargando ? (
          <p style={{ color: '#94a3b8' }}>Cargando...</p>
        ) : activos.length === 0 ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: 40 }}>
            No hay activos registrados. Usa el formulario de arriba para agregar el primero.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: 800,
              }}
            >
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(37, 99, 235, 0.3)' }}>
                  <th style={thStyle}>ID</th>
                  <th style={thStyle}>Descripción</th>
                  <th style={thStyle}>Tipo</th>
                  <th style={thStyle}>Categoría</th>
                  <th style={thStyle}>Fecha Compra</th>
                  <th style={thStyle}>Valor</th>
                  <th style={thStyle}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {activos.map((a) => (
                  <tr
                    key={a.idActivo}
                    style={{ borderBottom: '1px solid rgba(37, 99, 235, 0.1)' }}
                  >
                    <td style={tdStyle}>#{a.idActivo}</td>
                    <td style={{ ...tdStyle, color: '#fff', fontWeight: 500 }}>
                      {a.descripcion}
                    </td>
                    <td style={tdStyle}>{a.nombreTipo}</td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          background: 'rgba(59, 130, 246, 0.15)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          color: '#60a5fa',
                          padding: '4px 10px',
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        {a.nombreCategoria}
                      </span>
                    </td>
                    <td style={tdStyle}>{formatoFecha(a.fechaCompra)}</td>
                    <td style={{ ...tdStyle, color: '#4ade80', fontWeight: 700 }}>
                      {formatoMoneda(a.valorCompra)}
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => editarActivo(a)}
                          style={btnSmallStyle}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => eliminarActivo(a.idActivo)}
                          style={{ ...btnSmallStyle, color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Estilos inline
const thStyle = {
  textAlign: 'left',
  padding: '12px 16px',
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: 1.2,
  color: '#60a5fa',
  fontWeight: 700,
  whiteSpace: 'nowrap',
};

const tdStyle = {
  padding: '16px',
  fontSize: 13,
  color: '#cbd5e1',
};

const btnSmallStyle = {
  background: 'transparent',
  border: '1px solid rgba(59, 130, 246, 0.3)',
  color: '#60a5fa',
  padding: '6px 12px',
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'Poppins, sans-serif',
  transition: 'all 0.2s ease',
};