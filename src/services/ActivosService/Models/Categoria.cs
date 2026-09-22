namespace ActivosService.Models
{
    public class Categoria
    {
        public int IdCategoria { get; set; }
        public string NombreCategoria { get; set; } = "";
        public int VidaUtilAnios { get; set; }
        public decimal PorcentajeValorResidual { get; set; }
    }
}