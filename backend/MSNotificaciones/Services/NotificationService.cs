using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using MSNotificaciones.Data;
using MSNotificaciones.DTOs;
using MSNotificaciones.Hubs;
using MSNotificaciones.Interfaces;
using MSNotificaciones.Models;

namespace MSNotificaciones.Services
{
    public class NotificationService : INotificationService
    {
        private readonly NotificacionesDbContext _context;
        private readonly IHubContext<NotificacionesHub> _hubContext;

        public NotificationService(NotificacionesDbContext context, IHubContext<NotificacionesHub> hubContext)
        {
            _context = context;
            _hubContext = hubContext;
        }

        public async Task EnviarNotificacionAsync(string receptorId, string tipoReceptor, string titulo, string mensaje)
        {
            if (string.IsNullOrEmpty(receptorId) || string.IsNullOrEmpty(tipoReceptor))
                throw new ArgumentException("El receptor o el tipo no pueden estar vacíos");

            // 1. Construcción del grupo SignalR al que pertenece el receptor
            var grupo = $"{tipoReceptor}:{receptorId}";

            // 2. Envío de notificación en tiempo real al grupo
            await _hubContext.Clients.Group(grupo).SendAsync("RecibirNotificacion", new
            {
                titulo,
                mensaje,
                fecha = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")
            });

            // 3. Registro en base de datos
            var notificacion = new Notificacione
            {
                ReceptorId = receptorId,
                TipoReceptor = tipoReceptor,
                Titulo = titulo,
                Mensaje = mensaje,
                FechaEnvio = DateTime.Now,
                Leido = false
            };

            await GuardarNotificacionAsync(notificacion);
        }

        public async Task GuardarNotificacionAsync(Notificacione notificacion)
        {
            _context.Notificaciones.Add(notificacion);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Notificacione>> ObtenerNotificaciones(NotificacionDTO notificacionDto)
        {
            return await _context.Notificaciones
                .Where(n =>
                    n.ReceptorId == notificacionDto.ReceptorId &&
                    n.TipoReceptor == notificacionDto.TipoReceptor)
                .OrderByDescending(n => n.FechaEnvio)
                .ToListAsync();
        }

        public async Task MarcarNotificacionComoLeida(int id)
        {
            var notificacion = await _context.Notificaciones.FindAsync(id);
            if (notificacion == null)
                throw new KeyNotFoundException($"No se encontró la notificación con ID {id}");

            notificacion.Leido = true;
            await _context.SaveChangesAsync();
        }

        public async Task MarcarTodasComoLeidas(string receptorId, string tipoReceptor)
        {
            var notificaciones = await _context.Notificaciones
                .Where(n =>
                    n.ReceptorId == receptorId &&
                    n.TipoReceptor == tipoReceptor &&
                    n.Leido == false)
                .ToListAsync();

            foreach (var notificacion in notificaciones)
                notificacion.Leido = true;

            await _context.SaveChangesAsync();
        }
    }
}
