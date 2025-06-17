namespace MSEvaluacionyDiagnostico.DTOs
{
    public class CrearSeguimientoDTO
    {
        public int EvaluacionId { get; set; }
        public int UsuarioId { get; set; }
        public decimal? ValorX { get; set; }
        public decimal? ValorY { get; set; }
        public decimal? ValorZ { get; set; }
        public string? Observaciones { get; set; }

        public List<RespuestaSeguimientoDTO> Respuestas { get; set; } = new();

    }
}
