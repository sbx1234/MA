using DepreciacionService.DTOs;
using DepreciacionService.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DepreciacionService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DepreciacionController : ControllerBase
    {
        private readonly CalculoDepreciacionService _service;

        public DepreciacionController(CalculoDepreciacionService service)
        {
            _service = service;
        }

        [HttpPost("calcular")]
        public IActionResult Calcular([FromBody] CalcularDepreciacionDTO dto)
        {
            if (!ModelState.IsValid)
            {
                var errores = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage);
                return BadRequest(new { mensaje = string.Join(" | ", errores) });
            }

            var (exito, mensaje, resultado) = _service.Calcular(dto);

            if (!exito)
                return BadRequest(new { mensaje });

            return Ok(resultado);
        }

        [HttpGet("historial/{idActivo}")]
        public IActionResult Historial(int idActivo)
        {
            var historial = _service.ObtenerHistorial(idActivo);
            return Ok(historial);
        }

        [HttpDelete("historial/{idActivo}")]
        public IActionResult Resetear(int idActivo)
        {
            var (exito, mensaje) = _service.ResetearHistorial(idActivo);
            if (!exito) return BadRequest(new { mensaje });
            return Ok(new { mensaje });
        }
    }
}