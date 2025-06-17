namespace MSEvaluacionyDiagnostico.DTOs
{
    public class CrearEvaluacionDTO
    {
        public int PacienteId { get; set; }

        public DateTime Fecha { get; set; } = DateTime.Now;

        public float? ValorX { get; set; }

        public float? ValorY { get; set; }

        public float? ValorZ { get; set; }
        public string? Observaciones { get; set; }
        public List<CrearRespuestaDTO> Respuestas { get; set; } = new();
    }
}
