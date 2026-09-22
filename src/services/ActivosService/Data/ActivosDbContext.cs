using Microsoft.EntityFrameworkCore;
using ActivosService.Models;

namespace ActivosService.Data
{
    public class ActivosDbContext : DbContext
    {
        public ActivosDbContext(DbContextOptions<ActivosDbContext> options)
            : base(options)
        {
        }

        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<TipoActivo> TiposActivos { get; set; }
        public DbSet<Activo> Activos { get; set; }

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

                entidad.HasOne<Categoria>()
                    .WithMany()
                    .HasForeignKey(t => t.IdCategoria);
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

                entidad.HasOne<TipoActivo>()
                    .WithMany()
                    .HasForeignKey(a => a.IdTipo);
            });
        }
    }
}