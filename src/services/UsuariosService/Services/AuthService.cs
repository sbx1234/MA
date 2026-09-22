using UsuariosService.Data;
using UsuariosService.DTOs;
using UsuariosService.Models;

namespace UsuariosService.Services
{
    public class AuthService
    {
        private readonly AppDbContext _context;
        private readonly EmailService _emailService;

        public AuthService(AppDbContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        public Usuario? ValidarUsuario(LoginDTO login)
        {
            var usuario = _context.Usuarios
                .FirstOrDefault(u =>
                    u.NombreUsuario == login.Usuario &&
                    u.Estado == "ACTIVO");

            if (usuario == null)
                return null;

            // Verificar contraseña con BCrypt
            bool passwordValida = BCrypt.Net.BCrypt.Verify(login.Password, usuario.PasswordHash);

            return passwordValida ? usuario : null;
        }

        public async Task<(bool exito, string mensaje, int? idUsuario)> RegistrarUsuario(RegistroDTO registro)
        {
            if (_context.Usuarios.Any(u => u.NombreUsuario == registro.NombreUsuario))
                return (false, "El nombre de usuario ya esta en uso", null);

            if (_context.Usuarios.Any(u => u.Correo == registro.Correo))
                return (false, "El correo ya esta registrado", null);

            // Hashear la contraseña con BCrypt
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(registro.Password);

            var nuevoUsuario = new Usuario
            {
                Nombre = registro.Nombre.Trim(),
                Apellido = registro.Apellido.Trim(),
                Correo = registro.Correo.Trim().ToLower(),
                NombreUsuario = registro.NombreUsuario.Trim(),
                PasswordHash = passwordHash,
                Estado = "INACTIVO",  // Se activa al verificar el correo
                FechaRegistro = DateTime.Now
            };

            try
            {
                _context.Usuarios.Add(nuevoUsuario);
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                return (false, $"Error al registrar: {ex.Message}", null);
            }

            // Generar código de 6 dígitos
            var codigo = GenerarCodigo();

            var verificacion = new Verificacion
            {
                IdUsu = nuevoUsuario.IdUsuario,
                Codigo = codigo,
                Expira = DateTime.Now.AddMinutes(15),
                Usado = false,
                FechaCreacion = DateTime.Now
            };

            _context.Verificaciones.Add(verificacion);
            _context.SaveChanges();

            // Enviar correo
            try
            {
                await _emailService.EnviarCodigoVerificacion(nuevoUsuario.Correo, codigo);
            }
            catch (Exception ex)
            {
                return (false, $"Usuario creado pero fallo el envio de correo: {ex.Message}", nuevoUsuario.IdUsuario);
            }

            return (true, "Codigo enviado al correo", nuevoUsuario.IdUsuario);
        }

        public (bool exito, string mensaje) VerificarCodigo(int idUsuario, string codigo)
        {
            var verificacion = _context.Verificaciones
                .Where(v => v.IdUsu == idUsuario && !v.Usado)
                .OrderByDescending(v => v.FechaCreacion)
                .FirstOrDefault();

            if (verificacion == null)
                return (false, "No hay codigo pendiente para este usuario");

            if (verificacion.Expira < DateTime.Now)
                return (false, "El codigo ha expirado");

            if (verificacion.Codigo != codigo)
                return (false, "Codigo incorrecto");

            verificacion.Usado = true;

            var usuario = _context.Usuarios.FirstOrDefault(u => u.IdUsuario == idUsuario);
            if (usuario == null)
                return (false, "Usuario no encontrado");

            usuario.Estado = "ACTIVO";
            _context.SaveChanges();

            return (true, "Cuenta activada correctamente");
        }

        private string GenerarCodigo()
        {
            var random = new Random();
            return random.Next(100000, 999999).ToString();
        }
    }
}