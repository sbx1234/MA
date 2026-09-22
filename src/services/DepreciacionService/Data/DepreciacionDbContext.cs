using Microsoft.EntityFrameworkCore;
using DepreciacionService.Models;

namespace DepreciacionService.Data
{
    public class DepreciacionDbContext : DbContext
    {
        public DepreciacionDbContext(DbContextOptions<DepreciacionDbContext> options)
            : base(options)
        {
        }

        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<TipoActivo> TiposActivos { get; set; }
        public DbSet<Activo> Activos { get; set; }
        public DbSet<DetalleDepreciacion> DetallesDepreciacion { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // ===== CATEGORIAS =====
            modelBuilder.Entity<Categoria>(entidad =>
            {
                entidad.ToTable("CATEGORIAS");
                entidad.HasKey(c => c.IdCategoria);
                entidad.Property(c => c.IdCategoria).HasColumnName("ID_CAT");
                entidad.Property(c => c.NombreCategoria).HasColumnName("NOM_CAT");
                entidad.Property(c => c.VidaUtilAnios).HasColumnName("VID_UTI_ANIOS");
                entidad.Property(c => c.PorcentajeValorResidual).HasColumnName("POR_VAL_RES");
            });

            // ===== TIPOS_ACTIVOS =====
            modelBuilder.Entity<TipoActivo>(entidad =>
            {
                entidad.ToTable("TIPOS_ACTIVOS");
                entidad.HasKey(t => t.IdTipo);
                entidad.Property(t => t.IdTipo).HasColumnName("ID_TIPO");
                entidad.Property(t => t.NombreTipo).HasColumnName("NOM_TIPO");
                entidad.Property(t => t.IdCategoria).HasColumnName("ID_CAT_PER");
            });

            // ===== ACTIVOS =====
            modelBuilder.Entity<Activo>(entidad =>
            {
                entidad.ToTable("ACTIVOS");
                entidad.HasKey(a => a.IdActivo);
                entidad.Property(a => a.IdActivo).HasColumnName("ID_ACT");
                entidad.Property(a => a.Descripcion).HasColumnName("DES_ACT");
                entidad.Property(a => a.IdTipo).HasColumnName("ID_TIP_PER");
                entidad.Property(a => a.FechaCompra).HasColumnName("FECHA_COMPRA");
                entidad.Property(a => a.ValorCompra).HasColumnName("VALOR_COMPRA");
                entidad.Property(a => a.IdUsuario).HasColumnName("ID_USU_PER");
            });

            // ===== DETALLE_DEPRECIACION =====
            modelBuilder.Entity<DetalleDepreciacion>(entidad =>
            {
                entidad.ToTable("DETALLE_DEPRECIACION");
                entidad.HasKey(d => new { d.IdActPer, d.PerDep });
                entidad.Property(d => d.IdActPer).HasColumnName("ID_ACT_PER");
                entidad.Property(d => d.PerDep).HasColumnName("PER_DEP");
                entidad.Property(d => d.FecCor).HasColumnName("FEC_COR");
                entidad.Property(d => d.MesDep).HasColumnName("MES_DEP");
                entidad.Property(d => d.ValIni).HasColumnName("VAL_INI");
                entidad.Property(d => d.DepPer).HasColumnName("DEP_PER");
                entidad.Property(d => d.DepAcu).HasColumnName("DEP_ACU");
                entidad.Property(d => d.ValAct).HasColumnName("VAL_ACT");
            });
        }
    }
}