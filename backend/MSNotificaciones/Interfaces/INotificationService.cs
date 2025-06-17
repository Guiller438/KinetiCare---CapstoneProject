using MSNotificaciones.DTOs;
using MSNotificaciones.Models;

namespace MSNotificaciones.Interfaces
{
    public interface INotificationService
    {
        Task EnviarNotificacionAsync(string receptorId, string tipoReceptor, string titulo, string mensaje);
        Task GuardarNotificacionAsync(Notificacione notificacion);

        //Obtener Notificaciones
        Task<List<Notificacione>> ObtenerNotificaciones(NotificacionDTO notificacion);

        //Marcar como leido la notificación
        Task MarcarNotificacionComoLeida(int id);

        //Marcar todas las notificaciones como leidas
        Task MarcarTodasComoLeidas(string receptorId, string tipoReceptor);


    }
}
