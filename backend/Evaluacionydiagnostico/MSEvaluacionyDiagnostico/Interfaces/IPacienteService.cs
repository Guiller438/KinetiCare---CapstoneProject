using MSEvaluacionyDiagnostico.DTOs;
using MSEvaluacionyDiagnostico.Models;

namespace MSEvaluacionyDiagnostico.Interfaces
{
    public interface IPacienteService
    {
        //Método para obtener todos los pacientes
        Task<List<PacienteDTO>> ObtenerPacientes();

        //Método para obtener un paciente por su ID
        Task<PacienteDTO> ObtenerPacientePorId(int id);

        //Método para obtener pacientes por fisioterapeuta
        Task<List<PacienteDTO>> ObtenerPorFisioterapeutaAsync(int fisioterapeutaId);

        //Método de registro de un paciente
        Task<PacienteDTO> RegistrarPaciente(CrearPacienteDTO pacienteDTO);

        //Método de actualización de un paciente
        Task<bool> ActualizarPaciente(PacienteDTO pacienteDTO);

        //Método de eliminación de un paciente
        Task<bool> EliminarPaciente(int id);

        //Método para obtener pacientes por nombre
        Task<List<PacienteDTO>> ObtenerPacientesPorNombre(string nombre);

        //Método para obtener pacientes por diagnostico
        Task<List<PacienteDTO>> ObtenerPacientesPorDiagnostico(string diagnostico);

    }
}
