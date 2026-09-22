using System.ComponentModel.DataAnnotations;

namespace ActivosService.DTOs
{
    public class CrearActivoDTO
    {
        [Required(ErrorMessage = "La descripcion es obligatoria")]
        [StringLength(200, MinimumLength = 2)]
        public string Descripcion { get; set; } = "";

        [Required(ErrorMessage = "El tipo es obligatorio")]
        public int IdTipo { get; set; }

        [Required(ErrorMessage = "La fecha de compra es obligatoria")]
        public DateTime FechaCompra { get; set; }

        [Required(ErrorMessage = "El valor de compra es obligatorio")]
        [Range(0.01, double.MaxValue, ErrorMessage = "El valor debe ser mayor a 0")]
        public decimal ValorCompra { get; set; }
    }
}