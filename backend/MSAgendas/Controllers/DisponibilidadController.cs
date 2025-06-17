using Microsoft.AspNetCore.Mvc;
using MSAgendas.DTOs;
using MSAgendas.Interfaces;

namespace MSAgendas.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DisponibilidadController : ControllerBase
    {
        private readonly IDisponibilidadService _service;

        public DisponibilidadController(IDisponibilidadService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<ActionResult<ResultadoOperacionDTO>> Crear([FromBody] CrearDisponibilidadDTO dto)
        {
            var resultado = await _service.CrearDisponibilidadAsync(dto);
            return resultado.Exito ? Ok(resultado) : BadRequest(resultado);
        }

        [HttpGet("fisioterapeuta/{id}")]
        public async Task<ActionResult<IEnumerable<DisponibilidadDTO>>> ObtenerPorFisio(int id)
        {
            var lista = await _service.ObtenerPorFisioterapeutaAsync(id);
            return Ok(lista);
        }

        [HttpDelete("EliminarDisponibilidad/{id}")]
        public async Task<ActionResult<ResultadoOperacionDTO>> Eliminar(int id)
        {
            var resultado = await _service.EliminarDisponibilidadAsync(id);
            return resultado.Exito ? Ok(resultado) : BadRequest(resultado);
        }
    }
}
