using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UsuariosService.DTOs;
using UsuariosService.Services;

namespace UsuariosService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly JwtService _jwtService;

        public AuthController(AuthService authService, JwtService jwtService)
        {
            _authService = authService;
            _jwtService = jwtService;
        }

        [HttpPost("login")]
        public IActionResult Login(LoginDTO login)
        {
            var usuario = _authService.ValidarUsuario(login);

            if (usuario == null)
            {
                return Unauthorized(new { mensaje = "Usuario o contrasena incorrectos" });
            }

            string token = _jwtService.GenerarToken(usuario.IdUsuario, usuario.NombreUsuario);

            return Ok(new
            {
                mensaje = "Usuario correcto",
                token = token,
                usuario = new
                {
                    idUsuario = usuario.IdUsuario,
                    nombreUsuario = usuario.NombreUsuario,
                    nombre = usuario.Nombre,
                    apellido = usuario.Apellido,
                    correo = usuario.Correo
                }
            });
        }

        [HttpPost("registrar")]
        public async Task<IActionResult> Registrar(RegistroDTO registro)
        {
            if (!ModelState.IsValid)
            {
                var errores = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();

                return BadRequest(new { mensaje = string.Join(" | ", errores) });
            }

            var (exito, mensaje, idUsuario) = await _authService.RegistrarUsuario(registro);

            if (!exito)
                return BadRequest(new { mensaje });

            return Ok(new
            {
                mensaje,
                idUsuario,
                requiereVerificacion = true
            });
        }

        [HttpPost("verificar")]
        public IActionResult Verificar(VerificarDTO dto)
        {
            var (exito, mensaje) = _authService.VerificarCodigo(dto.IdUsuario, dto.Codigo);

            if (!exito)
                return BadRequest(new { mensaje });

            return Ok(new { mensaje });
        }

        [HttpGet("protegido")]
        [Authorize]
        public IActionResult Protegido()
        {
            return Ok("Acceso permitido con JWT");
        }
    }
}