namespace MSAgendas.DTOs
{
    public class CitaDTO
    {
        public int CitaId { get; set; }
        public string NombrePaciente { get; set; } = string.Empty;
        public string NombreFisioterapeuta { get; set; } = string.Empty;
        public DateTime FechaHora { get; set; }
        public string Estado { get; set; } = "Programada";
        public string? Observaciones { get; set; }
    }
}
