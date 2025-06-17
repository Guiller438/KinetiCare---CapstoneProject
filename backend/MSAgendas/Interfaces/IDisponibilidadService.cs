using MSAgendas.DTOs;

namespace MSAgendas.Interfaces
{
    public interface IDisponibilidadService
    {
        Task<ResultadoOperacionDTO> CrearDisponibilidadAsync(CrearDisponibilidadDTO dto);
        Task<IEnumerable<DisponibilidadDTO>> ObtenerPorFisioterapeutaAsync(int fisioterapeutaId);

        //Método para eliminar 
        Task<ResultadoOperacionDTO> EliminarDisponibilidadAsync(int disponibilidadId);


    }
}
