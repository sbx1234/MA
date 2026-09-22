using Microsoft.EntityFrameworkCore;
using UsuariosService.Models;

namespace UsuariosService.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Verificacion> Verificaciones { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // ===== USUARIOS =====
            modelBuilder.Entity<Usuario>(entidad =>
            {
                entidad.ToTable("USUARIOS");
                entidad.HasKey(u => u.IdUsuario);
                entidad.Property(u => u.IdUsuario).HasColumnName("ID_USU");
                entidad.Property(u => u.Nombre).HasColumnName("NOMBRE");
                entidad.Property(u => u.Apellido).HasColumnName("APELLIDO");
                entidad.Property(u => u.Correo).HasColumnName("CORREO");
                entidad.Property(u => u.NombreUsuario).HasColumnName("NOMBRE_USUARIO");
                entidad.Property(u => u.PasswordHash).HasColumnName("PASSWORD_HASH");
                entidad.Property(u => u.Estado).HasColumnName("ESTADO");
                entidad.Property(u => u.FechaRegistro).HasColumnName("FECHA_REGISTRO");
            });

            // ===== VERIFICACIONES =====
            modelBuilder.Entity<Verificacion>(entidad =>
            {
                entidad.ToTable("VERIFICACIONES");
                entidad.HasKey(v => v.IdVer);
                entidad.Property(v => v.IdVer).HasColumnName("ID_VER");
                entidad.Property(v => v.IdUsu).HasColumnName("ID_USU");
                entidad.Property(v => v.Codigo).HasColumnName("CODIGO");
                entidad.Property(v => v.Expira).HasColumnName("EXPIRA");
                entidad.Property(v => v.Usado).HasColumnName("USADO");
                entidad.Property(v => v.FechaCreacion).HasColumnName("FECHA_CREACION");

                entidad.HasOne(v => v.Usuario)
                    .WithMany()
                    .HasForeignKey(v => v.IdUsu);
            });
        }
    }
}