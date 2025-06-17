using Microsoft.AspNetCore.Mvc;
using MSNotificaciones.DTOs;
using MSNotificaciones.Interfaces;

namespace MSNotificaciones.Controllers
{
    [ApiController]
    [Route("api/whatsapp")]
    public class WhatsappController : ControllerBase
    {
        private readonly IWhatsappService _whatsappService;

        public WhatsappController(IWhatsappService whatsappService)
        {
            _whatsappService = whatsappService;
        }

        [HttpPost("enviar-cita")]
        public async Task<IActionResult> EnviarRecordatorio([FromBody] NotificacionCitaDTO dto)
        {
            var mensaje = $"Hola {dto.NombrePaciente}, recuerda tu cita el {dto.FechaCita:dd/MM/yyyy} a las {dto.FechaCita:HH:mm} con {dto.NombreFisioterapeuta}.";
            var enviado = await _whatsappService.EnviarMensaje(dto.NumeroDestino, mensaje);

            if (!enviado) return StatusCode(500, "❌ No se pudo enviar la notificación por WhatsApp.");
            return Ok("✅ Notificación enviada correctamente.");
        }
    }
}
