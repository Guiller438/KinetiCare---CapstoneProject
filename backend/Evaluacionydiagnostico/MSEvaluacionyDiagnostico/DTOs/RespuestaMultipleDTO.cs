namespace MSEvaluacionyDiagnostico.DTOs
{
    public class RespuestaMultipleDTO
    {
        public int EvaluacionId { get; set; }
        public int PacienteId { get; set; }
        public List<RespuestaPreguntaDTO> Respuestas { get; set; }
    }
}
