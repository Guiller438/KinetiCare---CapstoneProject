using MSAgendas.DTOs;

namespace MSAgendas.Interfaces
{
    public interface ICitaService
    {
        Task<IEnumerable<CitaDTO>> ObtenerCitasPorPacienteAsync(int pacienteId);

        Task<IEnumerable<CitaDTO>> ObtenerTodasLasCitasAsync();

        Task<IEnumerable<CitaDTO>> ObtenerCitasPorFisioterapeutaAsync(int fisioterapeutaId);
        Task<CitaDTO?> ObtenerCitaPorIdAsync(int citaId);

        Task<IEnumerable<DateTime>> ObtenerCitasOcupadasAsync(int fisioterapeutaId, DateTime fecha);


        Task<ResultadoOperacionDTO> CrearCitaAsync(CrearCitaDTO nuevaCita);
        Task<ResultadoOperacionDTO> CancelarCitaAsync(int citaId);
        Task<ResultadoOperacionDTO> ReprogramarCitaAsync(ReprogramarCitaDTO dto);

    }
}
