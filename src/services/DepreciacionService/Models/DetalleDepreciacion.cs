namespace DepreciacionService.Models
{
    public class DetalleDepreciacion
    {
        public int IdActPer { get; set; }        // ID del activo
        public int PerDep { get; set; }          // Número de período (1, 2, 3...)
        public DateTime FecCor { get; set; }     // Fecha del cálculo
        public int MesDep { get; set; }          // Meses depreciados en este período
        public decimal ValIni { get; set; }      // Valor inicial del período
        public decimal DepPer { get; set; }      // Depreciación del período
        public decimal DepAcu { get; set; }      // Depreciación acumulada
        public decimal ValAct { get; set; }      // Valor actual
    }
}