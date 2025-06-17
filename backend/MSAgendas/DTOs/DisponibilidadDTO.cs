namespace MSAgendas.DTOs
{
    public class DisponibilidadDTO
    {
        public int DisponibilidadId { get; set; }
        public int FisioterapeutaId { get; set; }
        public int DiaSemana { get; set; }
        public TimeOnly HoraInicio { get; set; }
        public TimeOnly HoraFin { get; set; }
    }
}
