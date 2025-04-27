using MSEvaluacionyDiagnostico.DTOs;

namespace MSEvaluacionyDiagnostico.Interfaces
{
    public interface IRespuestaService
    {
        Task<RespuestaDTO> CrearRespuestaAsync(CrearRespuestaDTO crearRespuestaDTO);
        Task<List<RespuestaDTO>> ObtenerRespuestasPorEvaluacionAsync(int evaluacionId);

        Task<List<RespuestaDTO>> CrearMultiplesRespuestasAsync(RespuestaMultipleDTO respuestaSentimientoDTO);
    }
}
