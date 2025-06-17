namespace MSAgendas.DTOs
{
    public class CrearCitaDTO
    {
        public int PacienteId { get; set; }
        public int FisioterapeutaId { get; set; }
        public DateTime FechaHora { get; set; }
        public string? Observaciones { get; set; }
    }
}
