namespace MSEvaluacionyDiagnostico.DTOs
{
    public class CrearEvaluacionDTO
    {
        public int PacienteId { get; set; }
        public int FisioterapeutaId { get; set; }
        public string? Observaciones { get; set; }
        public List<RespuestaDTO> Respuestas { get; set; } = new();
    }
}
