using System.ComponentModel.DataAnnotations;

namespace DepreciacionService.DTOs
{
    public class CalcularDepreciacionDTO
    {
        [Required(ErrorMessage = "El id del activo es obligatorio")]
        public int IdActivo { get; set; }

        [Required(ErrorMessage = "Los meses son obligatorios")]
        [Range(1, 240, ErrorMessage = "Los meses deben estar entre 1 y 240")]
        public int Meses { get; set; }
    }
}