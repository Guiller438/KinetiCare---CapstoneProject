using MSEvaluacionyDiagnostico.DTOs;
using MSEvaluacionyDiagnostico.Models;

namespace MSEvaluacionyDiagnostico.Interfaces
{
    public interface ISeguimientoService
    {
        /// <summary>
        /// Crea un nuevo seguimiento asociado a una evaluación base.
        /// </summary>
        Task<int> CrearSeguimientoAsync(CrearSeguimientoDTO dto);

        /// <summary>
        /// Obtiene todos los seguimientos realizados para una evaluación específica.
        /// </summary>
        Task<IEnumerable<Seguimiento>> ObtenerSeguimientosPorEvaluacionAsync(int evaluacionId);

        Task CrearMultiplesRespuestasAsync(int seguimientoId, List<RespuestaSeguimientoDTO> respuestas);

        //Método para obtener seguimientos por el evaluacion id

    }
}
