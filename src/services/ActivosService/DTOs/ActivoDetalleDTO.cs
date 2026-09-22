namespace ActivosService.DTOs
{
    public class ActivoDetalleDTO
    {
        public int IdActivo { get; set; }
        public string Descripcion { get; set; } = "";
        public int IdTipo { get; set; }
        public string NombreTipo { get; set; } = "";
        public int IdCategoria { get; set; }
        public string NombreCategoria { get; set; } = "";
        public int VidaUtilAnios { get; set; }
        public decimal PorcentajeValorResidual { get; set; }
        public DateTime FechaCompra { get; set; }
        public decimal ValorCompra { get; set; }
        public int IdUsuario { get; set; }
    }
}