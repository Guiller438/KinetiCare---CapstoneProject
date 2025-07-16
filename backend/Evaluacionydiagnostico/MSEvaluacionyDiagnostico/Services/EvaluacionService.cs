    using Azure.Core;
using Microsoft.EntityFrameworkCore;
using MSEvaluacionyDiagnostico.Data;
using MSEvaluacionyDiagnostico.DTOs;
using MSEvaluacionyDiagnostico.Interfaces;
using MSEvaluacionyDiagnostico.Models;

namespace MSEvaluacionyDiagnostico.Services
{
    public class EvaluacionService : IEvaluacionService
    {
        private readonly KinetiCareDbContext _context;
        private readonly IRespuestaService _respuestaService;
        public EvaluacionService(KinetiCareDbContext context, IRespuestaService respuestaService)
        {
            _context = context;
            _respuestaService = respuestaService;
        }

        public async Task<EvaluacionDTO> CrearEvaluacion(CrearEvaluacionDTO crearEvaluacionDTO)
        {
            // 1. Crear la evaluación y guardar
            var evaluacion = new Evaluacion
            {
                PacienteId = crearEvaluacionDTO.PacienteId,
                Fecha = crearEvaluacionDTO.Fecha,
                Observaciones = crearEvaluacionDTO.Observaciones,
                ValorX = null,
                ValorY = null,
                ValorZ = null
            };

            _context.Evaluacions.Add(evaluacion);
            await _context.SaveChangesAsync(); // Guarda para obtener el Id generado

            // 2. Preparar respuestas con EvaluacionId y PacienteId
            var respuestaMultipleDTO = new RespuestaMultipleDTO
            {
                EvaluacionId = evaluacion.Id,
                PacienteId = crearEvaluacionDTO.PacienteId,
                Respuestas = crearEvaluacionDTO.Respuestas
                    .Select(r => new RespuestaPreguntaDTO
                    {
                        PreguntaId = r.PreguntaId,
                        Valor = r.Valor
                    }).ToList()
            };

            // 3. Llamar al servicio de respuestas (inserta + analiza sentimientos)
            await _respuestaService.CrearMultiplesRespuestasAsync(respuestaMultipleDTO);

            // 4. Devolver DTO
            return new EvaluacionDTO
            {
                Id = evaluacion.Id,
                PacienteId = evaluacion.PacienteId,
                Fecha = evaluacion.Fecha,
                Observaciones = evaluacion.Observaciones
            };
        }


        public async Task<List<EvaluacionFisioterapeutaDTO>> ObtenerEvaluacionesPorFisioterapeutaAsync(int usuarioId)
        {
            //Consulta en tabla de pacientes para ver los fisioterapeutas de los pacientes

            var IdPacientes = await _context.Pacientes
                .Where(p => p.FisioterapeutaId == usuarioId)
                .Select(p => p.Id)
                .ToListAsync();

            //Consulta en tabla de evaluaciones para ver los pacientes que tienen evaluaciones

            var evaluaciones = await _context.Evaluacions
                .Where(e => IdPacientes.Contains(e.PacienteId))
                .Select(e => new EvaluacionFisioterapeutaDTO
                {
                    EvaluacionId = e.Id,
                    PacienteId = e.PacienteId,
                    Fecha = e.Fecha,
                    Observaciones = e.Observaciones,
                    NombrePaciente = e.Paciente.Nombres + " " + e.Paciente.Apellidos


                })
                .ToListAsync();

            return evaluaciones;
        }


    }
}
