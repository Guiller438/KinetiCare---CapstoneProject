using Microsoft.AspNetCore.Mvc;
using MSNotificaciones.DTOs;
using MSNotificaciones.Interfaces;

namespace MSNotificaciones.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notificationService;

        public NotificationController(INotificationService notificationService)
        {
            _notificationService = notificationService;
        }

        [HttpPost("enviar")]
        public async Task<IActionResult> Enviar([FromQuery] string receptorId, [FromQuery] string tipo, [FromQuery] string titulo, [FromQuery] string mensaje)
        {
            await _notificationService.EnviarNotificacionAsync(receptorId, tipo, titulo, mensaje);
            return Ok(new { mensaje = "Notificación enviada" });
        }

        [HttpGet("Notificaciones")]
        public async Task<IActionResult> ObtenerNotificaciones([FromQuery] NotificacionDTO dto)
        {
            var resultado = await _notificationService.ObtenerNotificaciones(dto);
            return Ok(resultado);
        }

        [HttpPatch("marcar-leida/{id}")]
        public async Task<IActionResult> MarcarComoLeida(int id)
        {
            try
            {
                await _notificationService.MarcarNotificacionComoLeida(id);
                return NoContent(); // 204
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { mensaje = "Notificación no encontrada" });
            }
        }

        [HttpPatch("MarcarTodasLeidas")]
        public async Task<IActionResult> MarcarTodasLeidas([FromQuery] string receptorId, [FromQuery] string tipoReceptor)
        {
            await _notificationService.MarcarTodasComoLeidas(receptorId, tipoReceptor);
            return NoContent(); // 204
        }




    }
}
