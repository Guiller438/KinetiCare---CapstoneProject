using Microsoft.AspNetCore.Mvc;
using MSEvaluacionyDiagnostico.DTOs;
using MSEvaluacionyDiagnostico.Interfaces;

namespace MSEvaluacionyDiagnostico.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class PacienteController : Controller
    {
        private readonly IPacienteService _pacienteService;

        public PacienteController(IPacienteService pacienteService)
        {
            _pacienteService = pacienteService;
        }

        // GET: api/paciente
        [HttpGet("obtenerPacientes")]
        public async Task<IActionResult> ObtenerTodos()
        {
            var pacientes = await _pacienteService.ObtenerPacientes();
            return Ok(pacientes);
        }

        // GET: api/paciente/{id}
        [HttpGet("pacienteporid/{id}")]
        public async Task<IActionResult> ObtenerPorId(int id)
        {
            try
            {
                var paciente = await _pacienteService.ObtenerPacientePorId(id);
                return Ok(paciente);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        // GET: api/paciente/fisioterapeuta/{id}
        [HttpGet("pacienteporfisioterapeuta/{id}")]
        public async Task<IActionResult> ObtenerPorFisioterapeuta(int id)
        {
            try
            {
                var pacientes = await _pacienteService.ObtenerPorFisioterapeutaAsync(id);
                return Ok(pacientes);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        // GET: api/paciente/buscar?nombre=Juan
        [HttpGet("buscarpornombre")]
        public async Task<IActionResult> BuscarPorNombre([FromQuery] string nombre)
        {
            try
            {
                var pacientes = await _pacienteService.ObtenerPacientesPorNombre(nombre);
                return Ok(pacientes);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        // GET: api/paciente/diagnostico/Lumbalgia
        [HttpGet("pacientepordiagnostico/{diagnostico}")]
        public async Task<IActionResult> BuscarPorDiagnostico(string diagnostico)
        {
            try
            {
                var pacientes = await _pacienteService.ObtenerPacientesPorDiagnostico(diagnostico);
                return Ok(pacientes);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        // POST: api/paciente
        [HttpPost("crearPaciente")]
        public async Task<IActionResult> Crear([FromBody] CrearPacienteDTO pacienteDTO)
        {
            var paciente = await _pacienteService.RegistrarPaciente(pacienteDTO);
            return CreatedAtAction(nameof(ObtenerPorId), new { id = paciente.Id }, paciente);
        }

        // PUT: api/paciente/{id}
        [HttpPut("actualizarPaciente/{id}")]
        public async Task<IActionResult> Actualizar(int id, [FromBody] PacienteDTO pacienteDTO)
        {
            if (id != pacienteDTO.Id)
                return BadRequest("El ID no coincide.");

            try
            {
                var actualizado = await _pacienteService.ActualizarPaciente(pacienteDTO);
                if (!actualizado)
                    return NotFound("Paciente no encontrado.");

                return NoContent();
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        // DELETE: api/paciente/{id}
        [HttpDelete("eliminarPaciente/{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            try
            {
                var eliminado = await _pacienteService.EliminarPaciente(id);
                if (!eliminado)
                    return NotFound("Paciente no encontrado.");

                return NoContent();
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
