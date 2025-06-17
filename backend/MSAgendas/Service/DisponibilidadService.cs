using Microsoft.EntityFrameworkCore;
using MSAgendas.Data;
using MSAgendas.DTOs;
using MSAgendas.Interfaces;
using MSAgendas.Models;

namespace MSAgendas.Services
{
    public class DisponibilidadService : IDisponibilidadService
    {
        private readonly AgendaDbContext _context;

        public DisponibilidadService(AgendaDbContext context)
        {
            _context = context;
        }

        public async Task<ResultadoOperacionDTO> CrearDisponibilidadAsync(CrearDisponibilidadDTO dto)
        {
            var nueva = new DisponibilidadFisioterapeutum
            {
                FisioterapeutaId = dto.FisioterapeutaId,
                DiaSemana = dto.DiaSemana,
                HoraInicio = dto.HoraInicio,
                HoraFin = dto.HoraFin,
                FechaCreacion = DateTime.Now
            };

            _context.DisponibilidadFisioterapeuta.Add(nueva);
            var exito = await _context.SaveChangesAsync() > 0;

            return new ResultadoOperacionDTO
            {
                Exito = exito,
                Mensaje = exito ? "✅ Disponibilidad registrada correctamente." : "❌ Error al guardar la disponibilidad."
            };
        }

        public async Task<IEnumerable<DisponibilidadDTO>> ObtenerPorFisioterapeutaAsync(int fisioterapeutaId)
        {
            return await _context.DisponibilidadFisioterapeuta
                .Where(d => d.FisioterapeutaId == fisioterapeutaId)
                .Select(d => new DisponibilidadDTO
                {
                    DisponibilidadId = d.DisponibilidadId,
                    FisioterapeutaId = d.FisioterapeutaId,
                    DiaSemana = d.DiaSemana,
                    HoraInicio = d.HoraInicio,
                    HoraFin = d.HoraFin
                })
                .ToListAsync();
        }

        // Método para eliminar una disponibilidad por ID

        public async Task<ResultadoOperacionDTO> EliminarDisponibilidadAsync(int disponibilidadId)
        {
            var disponibilidad = await _context.DisponibilidadFisioterapeuta.FindAsync(disponibilidadId);
            if (disponibilidad == null)
            {
                return new ResultadoOperacionDTO
                {
                    Exito = false,
                    Mensaje = "❌ Disponibilidad no encontrada."
                };
            }
            _context.DisponibilidadFisioterapeuta.Remove(disponibilidad);
            var exito = await _context.SaveChangesAsync() > 0;
            return new ResultadoOperacionDTO
            {
                Exito = exito,
                Mensaje = exito ? "✅ Disponibilidad eliminada correctamente." : "❌ Error al eliminar la disponibilidad."
            };
        }
    }
}
