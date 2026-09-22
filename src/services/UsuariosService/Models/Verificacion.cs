namespace UsuariosService.Models
{
    public class Verificacion
    {
        public int IdVer { get; set; }
        public int IdUsu { get; set; }
        public string Codigo { get; set; } = "";
        public DateTime Expira { get; set; }
        public bool Usado { get; set; }
        public DateTime FechaCreacion { get; set; }

        public Usuario? Usuario { get; set; }
    }
}