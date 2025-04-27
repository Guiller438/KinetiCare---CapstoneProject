using MSEvaluacionyDiagnostico.DTOs;

namespace MSEvaluacionyDiagnostico.Interfaces
{
    public interface IPreguntaService
    {
        Task<PreguntaDTO> CrearPreguntaAsync(CrearPreguntaDTO crearPreguntaDTO);
        Task<List<PreguntaDTO>> ObtenerPreguntasAsync();
        Task<PreguntaDTO> ObtenerPreguntaPorIdAsync(int id);
        Task<bool> EliminarPreguntaAsync(int id);



    }
}
