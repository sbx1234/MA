namespace DepreciacionService.DTOs
{
    public class ResultadoDepreciacionDTO
    {
        public int IdActivo { get; set; }
        public string Descripcion { get; set; } = "";
        public string NombreTipo { get; set; } = "";
        public string NombreCategoria { get; set; } = "";
        public int VidaUtilAnios { get; set; }
        public decimal PorcentajeValorResidual { get; set; }
        public DateTime FechaCompra { get; set; }
        public decimal ValorCompra { get; set; }

        // Resultados del cálculo
        public int Periodo { get; set; }
        public int MesesCalculados { get; set; }
        public decimal ValorResidual { get; set; }
        public decimal ValorDepreciable { get; set; }
        public decimal DepreciacionAnual { get; set; }
        public decimal DepreciacionMensual { get; set; }
        public decimal DepreciacionPeriodo { get; set; }
        public decimal DepreciacionAcumulada { get; set; }
        public decimal ValorActual { get; set; }
        public bool LlegoAlLimite { get; set; }  // true si ya llegó al residual
    }
}