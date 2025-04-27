namespace MSEvaluacionyDiagnostico.DTOs
{
    public class CrearRespuestaDTO
    {
        public int EvaluacionId { get; set; }
        public int PacienteId { get; set; }
        public int PreguntaId { get; set; }
        public string Valor { get; set; } = null!;
    }
}
