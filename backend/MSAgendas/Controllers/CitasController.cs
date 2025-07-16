using Microsoft.AspNetCore.Mvc;
using MSAgendas.DTOs;
using MSAgendas.Interfaces;

namespace MSAgendas.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CitasController : ControllerBase
    {
        private readonly ICitaService _citaService;

        public CitasController(ICitaService citaService)
        {
            _citaService = citaService;
        }

        // POST: api/citas
        [HttpPost]
        public async Task<ActionResult<ResultadoOperacionDTO>> CrearCita([FromBody] CrearCitaDTO dto)
        {
            var resultado = await _citaService.CrearCitaAsync(dto);
            return resultado.Exito ? Ok(resultado) : BadRequest(resultado);
        }

        [HttpGet("obtenerCitas")]
        public async Task<ActionResult<IEnumerable<CitaDTO>>> ObtenerTodasLasCitas()
        {
            var citas = await _citaService.ObtenerTodasLasCitasAsync();
            return Ok(citas);
        }


        // GET: api/citas/paciente/5
        [HttpGet("paciente/{pacienteId}")]
        public async Task<ActionResult<IEnumerable<CitaDTO>>> ObtenerCitasPorPaciente(int pacienteId)
        {
            var citas = await _citaService.ObtenerCitasPorPacienteAsync(pacienteId);
            return Ok(citas);
        }

        // GET: api/citas/fisioterapeuta/5
        [HttpGet("fisioterapeuta/{fisioterapeutaId}")]
        public async Task<ActionResult<IEnumerable<CitaDTO>>> ObtenerCitasPorFisioterapeuta(int fisioterapeutaId)
        {
            var citas = await _citaService.ObtenerCitasPorFisioterapeutaAsync(fisioterapeutaId);
            return Ok(citas);
        }

        // GET: api/citas/10
        [HttpGet("{citaId}")]
        public async Task<ActionResult<CitaDTO>> ObtenerCitaPorId(int citaId)
        {
            var cita = await _citaService.ObtenerCitaPorIdAsync(citaId);
            return cita != null ? Ok(cita) : NotFound();
        }

        // PUT: api/citas/cancelar/10
        [HttpPut("cancelar/{citaId}")]
        public async Task<ActionResult<ResultadoOperacionDTO>> CancelarCita(int citaId)
        {
            var resultado = await _citaService.CancelarCitaAsync(citaId);
            return resultado.Exito ? Ok(resultado) : BadRequest(resultado);
        }

        // PUT: api/citas/reprogramar
        [HttpPut("reprogramar")]
        public async Task<ActionResult<ResultadoOperacionDTO>> ReprogramarCita([FromBody] ReprogramarCitaDTO dto)
        {
            var resultado = await _citaService.ReprogramarCitaAsync(dto);
            return resultado.Exito ? Ok(resultado) : BadRequest(resultado);
        }

        [HttpGet("ocupadas")]
        public async Task<IActionResult> ObtenerHorariosOcupados([FromQuery] int fisioterapeutaId, [FromQuery] DateTime fecha)
        {
            var horasOcupadas = await _citaService.ObtenerCitasOcupadasAsync(fisioterapeutaId, fecha);
            return Ok(horasOcupadas);
        }



    }
}
