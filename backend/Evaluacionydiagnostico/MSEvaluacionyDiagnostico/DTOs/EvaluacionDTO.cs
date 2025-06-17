namespace MSEvaluacionyDiagnostico.DTOs
{
    public class EvaluacionDTO
    {
        public int Id { get; set; }
        public int PacienteId { get; set; }
        public DateTime Fecha { get; set; } = DateTime.Now;

        public float? ValorX { get; set; }

        public float? ValorY { get; set; }

        public float? ValorZ { get; set; }

        public string? Observaciones { get; set; }
    }
}
