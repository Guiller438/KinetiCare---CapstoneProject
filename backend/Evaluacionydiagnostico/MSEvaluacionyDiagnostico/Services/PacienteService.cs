using Microsoft.EntityFrameworkCore;
using MSEvaluacionyDiagnostico.Data;
using MSEvaluacionyDiagnostico.DTOs;
using MSEvaluacionyDiagnostico.Interfaces;
using MSEvaluacionyDiagnostico.Models;

namespace MSEvaluacionyDiagnostico.Services
{
    public class PacienteService : IPacienteService
    {
        private readonly KinetiCareDbContext _context;

        public PacienteService(KinetiCareDbContext context)
        {
            _context = context;
        }

        //Método para obtener todos los pacientes

        public async Task<List<PacienteDTO>> ObtenerPacientes()
        {
            return await _context.Pacientes
                .Select(p => new PacienteDTO
                {
                    Id = p.Id,
                    Nombres = p.Nombres,
                    Apellidos = p.Apellidos,
                    Edad = p.Edad,
                    Sexo = p.Sexo,
                    Diagnostico = p.Diagnostico,
                    FisioterapeutaId = p.FisioterapeutaId
                })
                .ToListAsync();
        }

        //Método para obtener un paciente por su ID

        public async Task<PacienteDTO> ObtenerPacientePorId(int id)
        {
            var paciente = await _context.Pacientes
                .Where(p => p.Id == id)
                .Select(p => new PacienteDTO
                {
                    Id = p.Id,
                    Nombres = p.Nombres,
                    Apellidos = p.Apellidos,
                    Edad = p.Edad,
                    Sexo = p.Sexo,
                    Diagnostico = p.Diagnostico,
                    FisioterapeutaId = p.FisioterapeutaId
                })
                .FirstOrDefaultAsync();

            return paciente ?? throw new Exception("Paciente no encontrado");
        }

        //Método para obtener pacientes por fisioterapeuta

        public async Task<List<PacienteDTO>> ObtenerPorFisioterapeutaAsync(int fisioterapeutaId)
        {
            var paciente =  await _context.Pacientes
                .Where(p => p.FisioterapeutaId == fisioterapeutaId)
                .Select(p => new PacienteDTO
                {
                    Id = p.Id,
                    Nombres = p.Nombres ?? "Nombre no especificado",
                    Apellidos = p.Apellidos ?? "Apellido no especificado",
                    Edad = p.Edad,
                    Sexo = p.Sexo ?? "Sexo no especificado",
                    Diagnostico = p.Diagnostico ?? "Diagnóstico no especificado",
                    FisioterapeutaId = p.FisioterapeutaId
                })
                .ToListAsync();

            return paciente ?? throw new Exception("No se encontraron pacientes para el fisioterapeuta especificado");
        }

        //Método de registro de un paciente

        public async Task<PacienteDTO> RegistrarPaciente(CrearPacienteDTO pacienteDTO)
        {
            var paciente = new Paciente
            {
                Nombres = pacienteDTO.Nombres,
                Apellidos = pacienteDTO.Apellidos,
                FechaNacimiento = pacienteDTO.FechaNacimiento,
                Sexo = pacienteDTO.Sexo,
                Diagnostico = pacienteDTO.Diagnostico,
                FisioterapeutaId = pacienteDTO.FisioterapeutaId
            };

            _context.Pacientes.Add(paciente);
            await _context.SaveChangesAsync();

            return new PacienteDTO
            {
                Id = paciente.Id,
                Nombres = paciente.Nombres,
                Apellidos = paciente.Apellidos,
                Edad = paciente.Edad,
                Sexo = paciente.Sexo,
                Diagnostico = paciente.Diagnostico,
                FisioterapeutaId = paciente.FisioterapeutaId
            };
        }

        //Método de actualización de un paciente

        public async Task<bool> ActualizarPaciente(PacienteDTO pacienteDTO)
        {
            var paciente = await _context.Pacientes.FindAsync(pacienteDTO.Id);
            if (paciente == null)
            {
                throw new Exception("Paciente no encontrado");
            }
            paciente.Nombres = pacienteDTO.Nombres;
            paciente.Apellidos = pacienteDTO.Apellidos;
            paciente.Sexo = pacienteDTO.Sexo;
            paciente.Diagnostico = pacienteDTO.Diagnostico;
            paciente.FisioterapeutaId = pacienteDTO.FisioterapeutaId;
            _context.Pacientes.Update(paciente);
            await _context.SaveChangesAsync();
            return true;
        }

        //Método de eliminación de un paciente

        public async Task<bool> EliminarPaciente(int id)
        {
            var paciente = await _context.Pacientes.FindAsync(id);
            if (paciente == null)
            {
                throw new Exception("Paciente no encontrado");
            }
            _context.Pacientes.Remove(paciente);
            await _context.SaveChangesAsync();
            return true;
        }

        //Método para obtener pacientes por nombre

        public async Task<List<PacienteDTO>> ObtenerPacientesPorNombre(string nombre)
        {
            var paciente =  await _context.Pacientes
                .Where(p => p.Nombres.Contains(nombre) || p.Apellidos.Contains(nombre))
                .Select(p => new PacienteDTO
                {
                    Id = p.Id,
                    Nombres = p.Nombres,
                    Apellidos = p.Apellidos,
                    Edad = p.Edad,
                    Sexo = p.Sexo,
                    Diagnostico = p.Diagnostico,
                    FisioterapeutaId = p.FisioterapeutaId
                })
                .ToListAsync();

            return paciente ?? throw new Exception("No se encontraron pacientes con ese nombre");
        }

        //Método para obtener pacientes por diagnostico

        public async Task<List<PacienteDTO>> ObtenerPacientesPorDiagnostico(string diagnostico)
        {
            var paciente = await _context.Pacientes
                .Where(p => p.Diagnostico.Contains(diagnostico))
                .Select(p => new PacienteDTO
                {
                    Id = p.Id,
                    Nombres = p.Nombres,
                    Apellidos = p.Apellidos,
                    Edad = p.Edad,
                    Sexo = p.Sexo,
                    Diagnostico = p.Diagnostico,
                    FisioterapeutaId = p.FisioterapeutaId
                })
                .ToListAsync();
            return paciente ?? throw new Exception("No se encontraron pacientes con ese diagnóstico");
        }

    }
}
