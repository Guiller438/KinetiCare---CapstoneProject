using Microsoft.EntityFrameworkCore;
using MSEvaluacionyDiagnostico.Data;
using MSEvaluacionyDiagnostico.DTOs;
using MSEvaluacionyDiagnostico.Interfaces;
using MSEvaluacionyDiagnostico.Models;

namespace MSEvaluacionyDiagnostico.Services
{
    public class PreguntaService : IPreguntaService
    {
        private readonly KinetiCareDbContext _context;

        public PreguntaService(KinetiCareDbContext context)
        {
            _context = context;
        }

        public async Task<PreguntaDTO> CrearPreguntaAsync(CrearPreguntaDTO crearPreguntaDTO)
        {
            var pregunta = new Preguntum
            {
                Texto = crearPreguntaDTO.Texto
            };

            _context.Pregunta.Add(pregunta);
            await _context.SaveChangesAsync();

            return new PreguntaDTO
            {
                Id = pregunta.Id,
                Texto = pregunta.Texto
            };
        }

        public async Task<List<PreguntaDTO>> ObtenerPreguntasAsync()
        {
            return await _context.Pregunta
                .Select(p => new PreguntaDTO
                {
                    Id = p.Id,
                    Texto = p.Texto
                }).ToListAsync();
        }

        public async Task<PreguntaDTO> ObtenerPreguntaPorIdAsync(int id)
        {
            var pregunta = await _context.Pregunta.FindAsync(id);
            if (pregunta == null)
                throw new Exception("Pregunta no encontrada.");

            return new PreguntaDTO
            {
                Id = pregunta.Id,
                Texto = pregunta.Texto
            };
        }

        public async Task<bool> EliminarPreguntaAsync(int id)
        {
            var pregunta = await _context.Pregunta.FindAsync(id);
            if (pregunta == null)
                return false;

            _context.Pregunta.Remove(pregunta);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
