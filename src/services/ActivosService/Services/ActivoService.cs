using ActivosService.Data;
using ActivosService.DTOs;
using ActivosService.Models;
using Microsoft.EntityFrameworkCore;

namespace ActivosService.Services
{
    public class ActivoService
    {
        private readonly ActivosDbContext _context;

        public ActivoService(ActivosDbContext context)
        {
            _context = context;
        }

        // Listar todos los activos con detalle de tipo y categoría
        public List<ActivoDetalleDTO> Listar()
        {
            var activos = _context.Activos.ToList();
            var tipos = _context.TiposActivos.ToList();
            var categorias = _context.Categorias.ToList();

            return activos.Select(a =>
            {
                var tipo = tipos.FirstOrDefault(t => t.IdTipo == a.IdTipo);
                var categoria = tipo != null
                    ? categorias.FirstOrDefault(c => c.IdCategoria == tipo.IdCategoria)
                    : null;

                return new ActivoDetalleDTO
                {
                    IdActivo = a.IdActivo,
                    Descripcion = a.Descripcion,
                    IdTipo = a.IdTipo,
                    NombreTipo = tipo?.NombreTipo ?? "Desconocido",
                    IdCategoria = categoria?.IdCategoria ?? 0,
                    NombreCategoria = categoria?.NombreCategoria ?? "Desconocida",
                    VidaUtilAnios = categoria?.VidaUtilAnios ?? 0,
                    PorcentajeValorResidual = categoria?.PorcentajeValorResidual ?? 0,
                    FechaCompra = a.FechaCompra,
                    ValorCompra = a.ValorCompra,
                    IdUsuario = a.IdUsuario
                };
            }).OrderByDescending(a => a.IdActivo).ToList();
        }

        // Obtener un activo por id
        public ActivoDetalleDTO? ObtenerPorId(int id)
        {
            var activo = _context.Activos.FirstOrDefault(a => a.IdActivo == id);
            if (activo == null) return null;

            var tipo = _context.TiposActivos.FirstOrDefault(t => t.IdTipo == activo.IdTipo);
            var categoria = tipo != null
                ? _context.Categorias.FirstOrDefault(c => c.IdCategoria == tipo.IdCategoria)
                : null;

            return new ActivoDetalleDTO
            {
                IdActivo = activo.IdActivo,
                Descripcion = activo.Descripcion,
                IdTipo = activo.IdTipo,
                NombreTipo = tipo?.NombreTipo ?? "Desconocido",
                IdCategoria = categoria?.IdCategoria ?? 0,
                NombreCategoria = categoria?.NombreCategoria ?? "Desconocida",
                VidaUtilAnios = categoria?.VidaUtilAnios ?? 0,
                PorcentajeValorResidual = categoria?.PorcentajeValorResidual ?? 0,
                FechaCompra = activo.FechaCompra,
                ValorCompra = activo.ValorCompra,
                IdUsuario = activo.IdUsuario
            };
        }

        // Crear activo
        public ActivoDetalleDTO Crear(CrearActivoDTO dto, int idUsuario)
        {
            var nuevo = new Activo
            {
                Descripcion = dto.Descripcion.Trim(),
                IdTipo = dto.IdTipo,
                FechaCompra = dto.FechaCompra,
                ValorCompra = dto.ValorCompra,
                IdUsuario = idUsuario
            };

            _context.Activos.Add(nuevo);
            _context.SaveChanges();

            return ObtenerPorId(nuevo.IdActivo)!;
        }

        // Actualizar activo
        public (bool exito, string mensaje) Actualizar(int id, ActualizarActivoDTO dto)
        {
            var activo = _context.Activos.FirstOrDefault(a => a.IdActivo == id);
            if (activo == null) return (false, "Activo no encontrado");

            activo.Descripcion = dto.Descripcion.Trim();
            activo.IdTipo = dto.IdTipo;
            activo.FechaCompra = dto.FechaCompra;
            activo.ValorCompra = dto.ValorCompra;

            _context.SaveChanges();
            return (true, "Activo actualizado");
        }

        // Eliminar activo
        public (bool exito, string mensaje) Eliminar(int id)
        {
            var activo = _context.Activos.FirstOrDefault(a => a.IdActivo == id);
            if (activo == null) return (false, "Activo no encontrado");

            _context.Activos.Remove(activo);
            _context.SaveChanges();
            return (true, "Activo eliminado");
        }

        // Listar categorías
        public List<Categoria> ListarCategorias()
        {
            return _context.Categorias.ToList();
        }

        // Listar tipos
        public List<TipoActivo> ListarTipos()
        {
            return _context.TiposActivos.ToList();
        }
    }
}