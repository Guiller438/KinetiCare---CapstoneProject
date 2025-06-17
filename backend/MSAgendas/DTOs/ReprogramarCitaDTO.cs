namespace MSAgendas.DTOs
{
    public class ReprogramarCitaDTO
    {
        public int CitaId { get; set; }
        public DateTime NuevaFechaHora { get; set; }
        public string? Motivo { get; set; }
    }
}
