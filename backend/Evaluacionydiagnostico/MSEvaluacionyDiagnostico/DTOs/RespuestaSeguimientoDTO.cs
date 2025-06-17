namespace MSEvaluacionyDiagnostico.DTOs
{
    public class RespuestaSeguimientoDTO
    {
        public int PreguntaId { get; set; }
        public string Valor { get; set; } = string.Empty;
        public string? Sentimiento { get; set; }
    }
}
