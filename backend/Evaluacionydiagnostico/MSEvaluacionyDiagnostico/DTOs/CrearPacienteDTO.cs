namespace MSEvaluacionyDiagnostico.DTOs
{
    public class CrearPacienteDTO
    {
        public string Nombres { get; set; }
        public string Apellidos { get; set; }
        public DateTime? FechaNacimiento { get; set; } 
        public string Sexo { get; set; }
        public string Diagnostico { get; set; }
        public int? FisioterapeutaId { get; set; }
    }
}
