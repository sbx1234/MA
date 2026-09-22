using System.ComponentModel.DataAnnotations;

namespace ActivosService.DTOs
{
    public class ActualizarActivoDTO
    {
        [Required]
        [StringLength(200, MinimumLength = 2)]
        public string Descripcion { get; set; } = "";

        [Required]
        public int IdTipo { get; set; }

        [Required]
        public DateTime FechaCompra { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal ValorCompra { get; set; }
    }
}