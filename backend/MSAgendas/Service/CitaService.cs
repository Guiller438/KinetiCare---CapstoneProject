using Microsoft.EntityFrameworkCore;
using MSAgendas.Data;
using MSAgendas.DTOs;
using MSAgendas.Interfaces;
using MSAgendas.Models;

namespace MSAgendas.Services
{
    public class CitaService : ICitaService
    {
        private readonly AgendaDbContext _context;

        public CitaService(AgendaDbContext context)
        {
            _context = context;
        }

        public async Task<ResultadoOperacionDTO> CrearCitaAsync(CrearCitaDTO nuevaCita)
        {
            var diaSemana = (int)nuevaCita.FechaHora.DayOfWeek;
            var horaCita = nuevaCita.FechaHora.TimeOfDay;

            // ✅ Evaluación en memoria de los TimeOnly con ToTimeSpan()
            var disponibilidad = _context.DisponibilidadFisioterapeuta
                .Where(d =>
                    d.FisioterapeutaId == nuevaCita.FisioterapeutaId &&
                    d.DiaSemana == diaSemana)
                .AsEnumerable() // Desde aquí se ejecuta en memoria
                .FirstOrDefault(d =>
                    horaCita >= d.HoraInicio.ToTimeSpan() &&
                    horaCita < d.HoraFin.ToTimeSpan()
                );

            if (disponibilidad == null)
            {
                return new ResultadoOperacionDTO
                {
                    Exito = false,
                    Mensaje = "El fisioterapeuta no está disponible en ese horario."
                };
            }

            bool conflictoFisio = await _context.Cita.AnyAsync(c =>
                c.FisioterapeutaId == nuevaCita.FisioterapeutaId &&
                c.FechaHora == nuevaCita.FechaHora &&
                c.Estado == "Programada"
            );

            if (conflictoFisio)
            {
                return new ResultadoOperacionDTO
                {
                    Exito = false,
                    Mensaje = "El fisioterapeuta ya tiene una cita en ese horario."
                };
            }

            bool dobleCitaPaciente = await _context.Cita.AnyAsync(c =>
                c.PacienteId == nuevaCita.PacienteId &&
                c.FechaHora.Date == nuevaCita.FechaHora.Date &&
                c.Estado == "Programada"
            );

            if (dobleCitaPaciente)
            {
                return new ResultadoOperacionDTO
                {
                    Exito = false,
                    Mensaje = "El paciente ya tiene una cita programada ese día."
                };
            }

            var cita = new Citum
            {
                PacienteId = nuevaCita.PacienteId,
                FisioterapeutaId = nuevaCita.FisioterapeutaId,
                FechaHora = nuevaCita.FechaHora,
                Observaciones = nuevaCita.Observaciones,
                Estado = "Programada",
                FechaCreacion = DateTime.Now
            };

            _context.Cita.Add(cita);
            var resultado = await _context.SaveChangesAsync() > 0;

            return new ResultadoOperacionDTO
            {
                Exito = resultado,
                Mensaje = resultado ? "✅ Cita creada exitosamente." : "❌ No se pudo crear la cita."
            };
        }


        public async Task<IEnumerable<CitaDTO>> ObtenerCitasPorPacienteAsync(int pacienteId)
        {
            return await _context.Cita
                .Where(c => c.PacienteId == pacienteId)
                .Include(c => c.Paciente)
                .Include(c => c.Fisioterapeuta)
                .Select(c => new CitaDTO
                {
                    CitaId = c.CitaId,
                    NombrePaciente = c.Paciente.Nombres,
                    NombreFisioterapeuta = c.Fisioterapeuta.Nombre,
                    FechaHora = c.FechaHora,
                    Estado = c.Estado,
                    Observaciones = c.Observaciones
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<CitaDTO>> ObtenerCitasPorFisioterapeutaAsync(int fisioterapeutaId)
        {
            return await _context.Cita
                .Where(c => c.FisioterapeutaId == fisioterapeutaId)
                .Include(c => c.Paciente)
                .Include(c => c.Fisioterapeuta)
                .Select(c => new CitaDTO
                {
                    CitaId = c.CitaId,
                    NombrePaciente = c.Paciente.Nombres,
                    NombreFisioterapeuta = c.Fisioterapeuta.Nombre,
                    FechaHora = c.FechaHora,
                    Estado = c.Estado,
                    Observaciones = c.Observaciones
                })
                .ToListAsync();
        }

        public async Task<CitaDTO?> ObtenerCitaPorIdAsync(int citaId)
        {
            var c = await _context.Cita
                .Include(c => c.Paciente)
                .Include(c => c.Fisioterapeuta)
                .FirstOrDefaultAsync(c => c.CitaId == citaId);

            if (c == null) return null;

            return new CitaDTO
            {
                CitaId = c.CitaId,
                NombrePaciente = c.Paciente.Nombres,
                NombreFisioterapeuta = c.Fisioterapeuta.Nombre,
                FechaHora = c.FechaHora,
                Estado = c.Estado,
                Observaciones = c.Observaciones
            };
        }

        public async Task<ResultadoOperacionDTO> CancelarCitaAsync(int citaId)
        {
            var cita = await _context.Cita.FindAsync(citaId);
            if (cita == null)
            {
                return new ResultadoOperacionDTO
                {
                    Exito = false,
                    Mensaje = "La cita no existe."
                };
            }

            if (cita.Estado == "Cancelada")
            {
                return new ResultadoOperacionDTO
                {
                    Exito = false,
                    Mensaje = "La cita ya está cancelada."
                };
            }

            cita.Estado = "Cancelada";
            cita.FechaActualizacion = DateTime.Now;

            var exito = await _context.SaveChangesAsync() > 0;

            return new ResultadoOperacionDTO
            {
                Exito = exito,
                Mensaje = exito ? "✅ Cita cancelada con éxito." : "❌ No se pudo cancelar la cita."
            };
        }

        public async Task<ResultadoOperacionDTO> ReprogramarCitaAsync(ReprogramarCitaDTO reprogramacion)
        {
            var cita = await _context.Cita.FindAsync(reprogramacion.CitaId);
            if (cita == null)
            {
                return new ResultadoOperacionDTO
                {
                    Exito = false,
                    Mensaje = "La cita no existe."
                };
            }

            var diaSemana = (int)reprogramacion.NuevaFechaHora.DayOfWeek;
            var horaNueva = reprogramacion.NuevaFechaHora.TimeOfDay;

            var disponibilidad = _context.DisponibilidadFisioterapeuta
                .Where(d =>
                    d.FisioterapeutaId == cita.FisioterapeutaId &&
                    d.DiaSemana == diaSemana)
                .AsEnumerable()
                .FirstOrDefault(d =>
                    horaNueva >= d.HoraInicio.ToTimeSpan() &&
                    horaNueva < d.HoraFin.ToTimeSpan()
                );


            if (disponibilidad == null)
            {
                return new ResultadoOperacionDTO
                {
                    Exito = false,
                    Mensaje = "El fisioterapeuta no está disponible en ese nuevo horario."
                };
            }

            bool conflicto = await _context.Cita.AnyAsync(c =>
                c.FisioterapeutaId == cita.FisioterapeutaId &&
                c.FechaHora == reprogramacion.NuevaFechaHora &&
                c.CitaId != cita.CitaId &&
                c.Estado == "Programada"
            );

            if (conflicto)
            {
                return new ResultadoOperacionDTO
                {
                    Exito = false,
                    Mensaje = "Ya existe una cita programada para ese horario."
                };
            }

            var reprogramacionCita = new ReprogramacionCitum
            {
                CitaId = cita.CitaId,
                FechaAnterior = cita.FechaHora,
                FechaNueva = reprogramacion.NuevaFechaHora,
                Motivo = reprogramacion.Motivo,
                FechaReprogramacion = DateTime.Now
            };

            cita.FechaHora = reprogramacion.NuevaFechaHora;
            cita.FechaActualizacion = DateTime.Now;
            cita.Estado = "Programada";

            _context.ReprogramacionCita.Add(reprogramacionCita);
            var exito = await _context.SaveChangesAsync() > 0;

            return new ResultadoOperacionDTO
            {
                Exito = exito,
                Mensaje = exito ? "✅ Cita reprogramada correctamente." : "❌ No se pudo reprogramar la cita."
            };
        }

        public async Task<IEnumerable<CitaDTO>> ObtenerTodasLasCitasAsync()
        {
            return await _context.Cita
                .Include(c => c.Paciente)
                .Include(c => c.Fisioterapeuta)
                .Select(c => new CitaDTO
                {
                    CitaId = c.CitaId,
                    NombrePaciente = c.Paciente.Nombres,
                    NombreFisioterapeuta = c.Fisioterapeuta.Nombre,
                    FechaHora = c.FechaHora,
                    Estado = c.Estado,
                    Observaciones = c.Observaciones
                })
                .ToListAsync();
        }

    }
}
