using System.Security.Claims;
using ActivosService.DTOs;
using ActivosService.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ActivosService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ActivosController : ControllerBase
    {
        private readonly ActivoService _service;

        public ActivosController(ActivoService service)
        {
            _service = service;
        }

        private int ObtenerIdUsuario()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(claim, out var id) ? id : 0;
        }

        [HttpGet]
        public IActionResult Listar()
        {
            return Ok(_service.Listar());
        }

        [HttpGet("{id}")]
        public IActionResult Obtener(int id)
        {
            var activo = _service.ObtenerPorId(id);
            if (activo == null) return NotFound(new { mensaje = "Activo no encontrado" });
            return Ok(activo);
        }

        [HttpPost]
        public IActionResult Crear([FromBody] CrearActivoDTO dto)
        {
            if (!ModelState.IsValid)
            {
                var errores = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage);
                return BadRequest(new { mensaje = string.Join(" | ", errores) });
            }

            var idUsuario = ObtenerIdUsuario();
            if (idUsuario == 0)
                return Unauthorized(new { mensaje = "Usuario no valido en el token" });

            var creado = _service.Crear(dto, idUsuario);
            return Ok(creado);
        }

        [HttpPut("{id}")]
        public IActionResult Actualizar(int id, [FromBody] ActualizarActivoDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { mensaje = "Datos invalidos" });

            var (exito, mensaje) = _service.Actualizar(id, dto);
            if (!exito) return NotFound(new { mensaje });
            return Ok(new { mensaje });
        }

        [HttpDelete("{id}")]
        public IActionResult Eliminar(int id)
        {
            var (exito, mensaje) = _service.Eliminar(id);
            if (!exito) return NotFound(new { mensaje });
            return Ok(new { mensaje });
        }

        [HttpGet("categorias")]
        public IActionResult ListarCategorias()
        {
            return Ok(_service.ListarCategorias());
        }

        [HttpGet("tipos")]
        public IActionResult ListarTipos()
        {
            return Ok(_service.ListarTipos());
        }
    }
}