namespace DepreciacionService.Models
{
    public class Activo
    {
        public int IdActivo { get; set; }
        public string Descripcion { get; set; } = "";
        public int IdTipo { get; set; }
        public DateTime FechaCompra { get; set; }
        public decimal ValorCompra { get; set; }
        public int IdUsuario { get; set; }
    }
}