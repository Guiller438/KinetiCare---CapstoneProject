namespace MSEvaluacionyDiagnostico.DTOs
{
    public class EvaluacionFisioterapeutaDTO
    {
        public int EvaluacionId { get; set; }
        public int PacienteId { get; set; }
        public DateTime Fecha { get; set; }
        public string Observaciones { get; set; }
        public string NombrePaciente { get; set; }

    }
}
