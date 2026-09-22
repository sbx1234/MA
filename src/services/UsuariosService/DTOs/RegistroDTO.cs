using System.ComponentModel.DataAnnotations;

namespace UsuariosService.DTOs
{
    public class RegistroDTO
    {
        [Required(ErrorMessage = "El nombre es obligatorio")]
        [StringLength(100, MinimumLength = 2)]
        public string Nombre { get; set; } = "";

        [Required(ErrorMessage = "El apellido es obligatorio")]
        [StringLength(100, MinimumLength = 2)]
        public string Apellido { get; set; } = "";

        [Required(ErrorMessage = "El correo es obligatorio")]
        [EmailAddress(ErrorMessage = "Formato de correo invalido")]
        [StringLength(150)]
        public string Correo { get; set; } = "";

        [Required(ErrorMessage = "El nombre de usuario es obligatorio")]
        [StringLength(50, MinimumLength = 3)]
        public string NombreUsuario { get; set; } = "";

        [Required(ErrorMessage = "La contrasena es obligatoria")]
        [StringLength(255, MinimumLength = 6)]
        public string Password { get; set; } = "";
    }
}
