using MSEvaluacionyDiagnostico.DTOs;

namespace MSEvaluacionyDiagnostico.Interfaces
{
    public interface IEvaluacionService
    {
        //Crear evaluacion
        
        Task<EvaluacionDTO> CrearEvaluacion(CrearEvaluacionDTO crearEvaluacionDTO);

        // Obtener evaluaciones por fisioterapeuta (usuario)
        Task<List<EvaluacionFisioterapeutaDTO>> ObtenerEvaluacionesPorFisioterapeutaAsync(int usuarioId);


    }
}
