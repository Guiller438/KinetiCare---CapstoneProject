namespace MSEvaluacionyDiagnostico.DTOs
{
    public class PacienteDTO
    {
        public int Id { get; set; }
        public string Nombres { get; set; }
        public string Apellidos { get; set; }

        public int? Edad { get; set; }
        public string Sexo { get; set; }
        public string Diagnostico { get; set; }
        public int? FisioterapeutaId { get; set; }
    }
}
