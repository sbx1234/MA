using DepreciacionService.Data;
using DepreciacionService.DTOs;
using DepreciacionService.Models;

namespace DepreciacionService.Services
{
    public class CalculoDepreciacionService
    {
        private readonly DepreciacionDbContext _context;

        public CalculoDepreciacionService(DepreciacionDbContext context)
        {
            _context = context;
        }

        public (bool exito, string mensaje, ResultadoDepreciacionDTO? resultado) Calcular(CalcularDepreciacionDTO dto)
        {
            // ===== 1. Obtener el activo =====
            var activo = _context.Activos.FirstOrDefault(a => a.IdActivo == dto.IdActivo);
            if (activo == null)
                return (false, "Activo no encontrado", null);

            // ===== 2. Obtener el tipo y la categoría =====
            var tipo = _context.TiposActivos.FirstOrDefault(t => t.IdTipo == activo.IdTipo);
            if (tipo == null)
                return (false, "Tipo de activo no encontrado", null);

            var categoria = _context.Categorias.FirstOrDefault(c => c.IdCategoria == tipo.IdCategoria);
            if (categoria == null)
                return (false, "Categoria no encontrada", null);

            // ===== 3. Fórmulas base =====
            decimal valorCompra = activo.ValorCompra;
            int vidaUtilAnios = categoria.VidaUtilAnios;
            decimal porcentajeResidual = categoria.PorcentajeValorResidual;

            decimal valorResidual = Math.Round(valorCompra * (porcentajeResidual / 100m), 2);
            decimal valorDepreciable = valorCompra - valorResidual;
            decimal depreciacionAnual = Math.Round(valorDepreciable / vidaUtilAnios, 2);
            decimal depreciacionMensual = Math.Round(depreciacionAnual / 12m, 2);

            // ===== 4. Obtener el último detalle de depreciación (si existe) =====
            var ultimoDetalle = _context.DetallesDepreciacion
                .Where(d => d.IdActPer == activo.IdActivo)
                .OrderByDescending(d => d.PerDep)
                .FirstOrDefault();

            int nuevoPeriodo = (ultimoDetalle?.PerDep ?? 0) + 1;
            decimal depreciacionAcumuladaAnterior = ultimoDetalle?.DepAcu ?? 0m;
            decimal valorInicialPeriodo = ultimoDetalle?.ValAct ?? valorCompra;

            // ===== 5. Calcular depreciación del período =====
            // Tope máximo: no puede depreciar más allá de lo que queda hasta el residual
            decimal depreciacionMaximaRestante = valorInicialPeriodo - valorResidual;
            decimal depreciacionPeriodoSinTope = Math.Round(depreciacionMensual * dto.Meses, 2);
            decimal depreciacionPeriodo = Math.Min(depreciacionPeriodoSinTope, depreciacionMaximaRestante);

            if (depreciacionPeriodo < 0) depreciacionPeriodo = 0;

            // ===== 6. Calcular acumulada y valor actual =====
            decimal depreciacionAcumulada = depreciacionAcumuladaAnterior + depreciacionPeriodo;
            decimal valorActual = valorCompra - depreciacionAcumulada;

            if (valorActual < valorResidual) valorActual = valorResidual;
            if (depreciacionAcumulada > valorDepreciable) depreciacionAcumulada = valorDepreciable;

            bool llegoAlLimite = valorActual <= valorResidual;

            // ===== 7. Guardar en la BD =====
            var detalle = new DetalleDepreciacion
            {
                IdActPer = activo.IdActivo,
                PerDep = nuevoPeriodo,
                FecCor = DateTime.Now,
                MesDep = dto.Meses,
                ValIni = valorInicialPeriodo,
                DepPer = depreciacionPeriodo,
                DepAcu = depreciacionAcumulada,
                ValAct = valorActual
            };

            _context.DetallesDepreciacion.Add(detalle);
            _context.SaveChanges();

            // ===== 8. Armar respuesta =====
            var resultado = new ResultadoDepreciacionDTO
            {
                IdActivo = activo.IdActivo,
                Descripcion = activo.Descripcion,
                NombreTipo = tipo.NombreTipo,
                NombreCategoria = categoria.NombreCategoria,
                VidaUtilAnios = vidaUtilAnios,
                PorcentajeValorResidual = porcentajeResidual,
                FechaCompra = activo.FechaCompra,
                ValorCompra = valorCompra,

                Periodo = nuevoPeriodo,
                MesesCalculados = dto.Meses,
                ValorResidual = valorResidual,
                ValorDepreciable = valorDepreciable,
                DepreciacionAnual = depreciacionAnual,
                DepreciacionMensual = depreciacionMensual,
                DepreciacionPeriodo = depreciacionPeriodo,
                DepreciacionAcumulada = depreciacionAcumulada,
                ValorActual = valorActual,
                LlegoAlLimite = llegoAlLimite
            };

            return (true, "Calculo exitoso", resultado);
        }

        // Obtener historial de cálculo de un activo
        public List<DetalleDepreciacion> ObtenerHistorial(int idActivo)
        {
            return _context.DetallesDepreciacion
                .Where(d => d.IdActPer == idActivo)
                .OrderBy(d => d.PerDep)
                .ToList();
        }

        // Resetear historial (para volver a calcular desde cero)
        public (bool exito, string mensaje) ResetearHistorial(int idActivo)
        {
            var detalles = _context.DetallesDepreciacion
                .Where(d => d.IdActPer == idActivo)
                .ToList();

            if (detalles.Count == 0)
                return (false, "No hay historial para este activo");

            _context.DetallesDepreciacion.RemoveRange(detalles);
            _context.SaveChanges();

            return (true, "Historial eliminado. Puede volver a calcular.");
        }
    }
}