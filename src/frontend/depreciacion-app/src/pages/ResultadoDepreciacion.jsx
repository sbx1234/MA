import { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

export default function ResultadoDepreciacion() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const resultado = location.state?.resultado;
  const tablaRef = useRef(null);

  useEffect(() => {
    if (!resultado) {
      navigate('/depreciacion');
    }
  }, [resultado, navigate]);

  if (!resultado) return null;

  const formatoMoneda = (v) =>
    Number(v).toLocaleString('es-EC', { style: 'currency', currency: 'USD' });

  const formatoFecha = (f) => new Date(f).toLocaleDateString('es-EC');

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const generarTablaEjemplo = () => {
    const filas = [];
    const mesesEjemplo = [4, 8, 12, 20, 24, 36, resultado.mesesCalculados];
    const mesesUnicos = [...new Set(mesesEjemplo)].sort((a, b) => a - b);

    const valorCompra = resultado.valorCompra;
    const valorResidual = resultado.valorResidual;
    const depMensual = resultado.depreciacionMensual;
    const vidaMeses = resultado.vidaUtilAnios * 12;

    for (const m of mesesUnicos) {
      const mesesReales = Math.min(m, vidaMeses);
      let depPeriodo = depMensual * m;
      let depAcumulada = depMensual * mesesReales;
      let valorActual = valorCompra - depAcumulada;

      if (valorActual < valorResidual) {
        valorActual = valorResidual;
        depAcumulada = valorCompra - valorResidual;
      }

      if (depPeriodo > valorCompra - valorResidual) {
        depPeriodo = valorCompra - valorResidual;
      }

      const formulaCalculo = `${formatoMoneda(depMensual)} × ${m}`;
      const nota = m > vidaMeses ? ' (máx. vida útil)' : '';

      filas.push({
        meses: m,
        formula: formulaCalculo + nota,
        depPeriodo,
        depAcumulada,
        valorActual,
      });
    }

    return filas;
  };

  const tabla = generarTablaEjemplo();

  const descargarPDF = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default;

      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.setTextColor(37, 99, 235);
      doc.text('Reporte de Depreciacion', 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generado el: ${new Date().toLocaleString('es-EC')}`, 14, 27);

      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text('Datos del Activo', 14, 40);

      autoTable(doc, {
        startY: 45,
        head: [['Campo', 'Valor']],
        body: [
          ['Descripcion', resultado.descripcion],
          ['Tipo', resultado.nombreTipo],
          ['Categoria', resultado.nombreCategoria],
          ['Vida util', `${resultado.vidaUtilAnios} anos`],
          ['% Residual', `${resultado.porcentajeValorResidual}%`],
          ['Fecha compra', formatoFecha(resultado.fechaCompra)],
          ['Valor compra', formatoMoneda(resultado.valorCompra)],
          ['Valor residual', formatoMoneda(resultado.valorResidual)],
          ['Valor depreciable', formatoMoneda(resultado.valorDepreciable)],
          ['Depreciacion anual', formatoMoneda(resultado.depreciacionAnual)],
          ['Depreciacion mensual', formatoMoneda(resultado.depreciacionMensual)],
        ],
        theme: 'grid',
        headStyles: { fillColor: [37, 99, 235] },
      });

      doc.addPage();
      doc.setFontSize(12);
      doc.text('Tabla de Depreciacion', 14, 20);

      autoTable(doc, {
        startY: 25,
        head: [['Meses', 'Calculo', 'Dep. Periodo', 'Dep. Acumulada', 'Valor Actual']],
        body: tabla.map((f) => [
          f.meses,
          f.formula,
          formatoMoneda(f.depPeriodo),
          formatoMoneda(f.depAcumulada),
          formatoMoneda(f.valorActual),
        ]),
        theme: 'grid',
        headStyles: { fillColor: [37, 99, 235] },
        styles: { fontSize: 9 },
      });

      doc.addPage();
      doc.setFontSize(12);
      doc.text(`Calculo del periodo: ${resultado.mesesCalculados} meses`, 14, 20);

      autoTable(doc, {
        startY: 25,
        head: [['Concepto', 'Valor']],
        body: [
          ['Periodo', `#${resultado.periodo}`],
          ['Meses calculados', resultado.mesesCalculados],
          ['Depreciacion del periodo', formatoMoneda(resultado.depreciacionPeriodo)],
          ['Depreciacion acumulada', formatoMoneda(resultado.depreciacionAcumulada)],
          ['Valor actual', formatoMoneda(resultado.valorActual)],
        ],
        theme: 'grid',
        headStyles: { fillColor: [34, 197, 94] },
      });

      doc.save(`depreciacion_activo_${resultado.idActivo}_${Date.now()}.pdf`);
    } catch (err) {
      console.error(err);
      alert('Error al generar el PDF: ' + err.message);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1>
            Resultado de <span className="nombre">Depreciación</span>
          </h1>
          <p style={{ color: '#94a3b8', marginTop: 8, fontSize: 14 }}>
            Detalle del cálculo y tabla de depreciación
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/depreciacion" className="btn-logout" style={{ textDecoration: 'none' }}>
            ← Volver a calcular
          </Link>
          <button className="btn-logout" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>

      <div style={cardStyle}>
        <h2 style={{ marginBottom: 20, fontSize: 18, fontWeight: 700 }}>
          Datos del Activo
        </h2>

        <div style={infoGridStyle}>
          <InfoItem label="Descripción" value={resultado.descripcion} />
          <InfoItem label="Tipo" value={resultado.nombreTipo} />
          <InfoItem label="Categoría" value={resultado.nombreCategoria} />
          <InfoItem label="Vida útil" value={`${resultado.vidaUtilAnios} años`} />
          <InfoItem label="% Residual" value={`${resultado.porcentajeValorResidual}%`} />
          <InfoItem label="Fecha compra" value={formatoFecha(resultado.fechaCompra)} />
        </div>
      </div>

      <div style={{ ...cardStyle, marginTop: 24 }}>
        <h2 style={{ marginBottom: 20, fontSize: 18, fontWeight: 700 }}>
          Cálculo Base
        </h2>

        <div style={infoGridStyle}>
          <InfoItem label="Valor compra" value={formatoMoneda(resultado.valorCompra)} highlight />
          <InfoItem label="Valor residual" value={formatoMoneda(resultado.valorResidual)} />
          <InfoItem label="Valor depreciable" value={formatoMoneda(resultado.valorDepreciable)} />
          <InfoItem label="Depreciación anual" value={formatoMoneda(resultado.depreciacionAnual)} />
          <InfoItem label="Depreciación mensual" value={formatoMoneda(resultado.depreciacionMensual)} highlight />
        </div>
      </div>

      <div style={{ ...cardStyle, marginTop: 24, borderColor: 'rgba(34, 197, 94, 0.4)' }}>
        <h2 style={{ marginBottom: 20, fontSize: 18, fontWeight: 700, color: '#4ade80' }}>
          ✓ Cálculo del Período #{resultado.periodo}
        </h2>

        <div style={infoGridStyle}>
          <InfoItem label="Meses calculados" value={resultado.mesesCalculados} />
          <InfoItem label="Depreciación del período" value={formatoMoneda(resultado.depreciacionPeriodo)} />
          <InfoItem label="Depreciación acumulada" value={formatoMoneda(resultado.depreciacionAcumulada)} />
          <InfoItem label="Valor actual" value={formatoMoneda(resultado.valorActual)} highlight />
        </div>

        {resultado.llegoAlLimite && (
          <p style={limiteStyle}>
            ✓ El activo llegó a su valor residual del {resultado.porcentajeValorResidual}%
          </p>
        )}
      </div>

      <div style={{ ...cardStyle, marginTop: 24 }} ref={tablaRef}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>
            Tabla de Depreciación
          </h2>
          <button onClick={descargarPDF} style={btnPdfStyle}>
            📄 Descargar PDF
          </button>
        </div>

        <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 16 }}>
          Ejemplos de cálculo según distintos meses ingresados:
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(37, 99, 235, 0.3)' }}>
                <th style={thStyle}>Meses</th>
                <th style={thStyle}>Cálculo</th>
                <th style={thStyle}>Dep. Período</th>
                <th style={thStyle}>Dep. Acumulada</th>
                <th style={thStyle}>Valor Actual</th>
              </tr>
            </thead>
            <tbody>
              {tabla.map((fila, i) => {
                const esActual = fila.meses === resultado.mesesCalculados;
                return (
                  <tr
                    key={i}
                    style={{
                      borderBottom: '1px solid rgba(37, 99, 235, 0.1)',
                      background: esActual ? 'rgba(34, 197, 94, 0.05)' : 'transparent',
                    }}
                  >
                    <td style={{ ...tdStyle, fontWeight: 600, color: esActual ? '#4ade80' : '#fff' }}>
                      {fila.meses}
                    </td>
                    <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: 12 }}>
                      {fila.formula}
                    </td>
                    <td style={{ ...tdStyle, color: '#60a5fa', fontWeight: 600 }}>
                      {formatoMoneda(fila.depPeriodo)}
                    </td>
                    <td style={tdStyle}>{formatoMoneda(fila.depAcumulada)}</td>
                    <td style={{ ...tdStyle, color: '#4ade80', fontWeight: 700 }}>
                      {formatoMoneda(fila.valorActual)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p style={notaStyle}>
          <strong style={{ color: '#60a5fa' }}>Nota:</strong> La depreciación se detiene cuando el activo
          alcanza su valor residual ({formatoMoneda(resultado.valorResidual)}). Esto ocurre a los{' '}
          {resultado.vidaUtilAnios * 12} meses (vida útil = {resultado.vidaUtilAnios} años).
        </p>
      </div>
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

const infoGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: 20,
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  minWidth: 800,
};

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
  padding: '14px 16px',
  fontSize: 13,
  color: '#cbd5e1',
};

const btnPdfStyle = {
  background: 'rgba(34, 197, 94, 0.1)',
  border: '1px solid rgba(34, 197, 94, 0.3)',
  color: '#4ade80',
  padding: '10px 18px',
  borderRadius: 10,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'Poppins, sans-serif',
};

const limiteStyle = {
  marginTop: 16,
  padding: 12,
  background: 'rgba(34, 197, 94, 0.1)',
  border: '1px solid rgba(34, 197, 94, 0.3)',
  borderRadius: 8,
  color: '#4ade80',
  fontSize: 13,
  textAlign: 'center',
};

const notaStyle = {
  marginTop: 20,
  padding: 16,
  background: 'rgba(59, 130, 246, 0.05)',
  border: '1px solid rgba(59, 130, 246, 0.2)',
  borderRadius: 10,
  color: '#cbd5e1',
  fontSize: 12,
  lineHeight: 1.6,
};