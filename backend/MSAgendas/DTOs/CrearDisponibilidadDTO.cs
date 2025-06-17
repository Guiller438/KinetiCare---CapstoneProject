namespace MSAgendas.DTOs
{
    public class CrearDisponibilidadDTO
    {
        public int FisioterapeutaId { get; set; }
        public int DiaSemana { get; set; } // 0=Domingo, 6=Sábado
        public TimeOnly HoraInicio { get; set; }
        public TimeOnly HoraFin { get; set; }
    }
}
