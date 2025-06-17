using Microsoft.AspNetCore.Mvc;
using MSEvaluacionyDiagnostico.DTOs;
using MSEvaluacionyDiagnostico.Interfaces;

namespace MSEvaluacionyDiagnostico.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EvaluacionController : Controller
    {
        private readonly IEvaluacionService _evaluacionService;
        private readonly ISeguimientoService _seguimientoService;

        public EvaluacionController(IEvaluacionService evaluacionService, ISeguimientoService seguimientoService)
        {
            _evaluacionService = evaluacionService;
            _seguimientoService = seguimientoService;
        }

        [HttpGet]
        public IActionResult ObtenerEvaluaciones()
        {
            // Aquí iría la lógica para obtener las evaluaciones
            return Ok(new { Message = "Lista de evaluaciones" });
        }

        //Crear evaluación
        [HttpPost("crear")]
        public async Task<ActionResult<EvaluacionDTO>> CrearEvaluacion([FromBody] CrearEvaluacionDTO dto)
        {
            var evaluacion = await _evaluacionService.CrearEvaluacion(dto);
            return Ok(evaluacion);
        }

        [HttpPost("iniciarSeguimiento")]
        public async Task<IActionResult> CrearSeguimiento([FromBody] CrearSeguimientoDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var seguimientoId = await _seguimientoService.CrearSeguimientoAsync(dto);
            return Ok(new { seguimientoId });
        }

        [HttpGet("fisioterapeuta/{usuarioId}")]
        public async Task<ActionResult<List<EvaluacionFisioterapeutaDTO>>> ObtenerEvaluacionesPorFisioterapeuta(int usuarioId)
        {
            var evaluaciones = await _evaluacionService.ObtenerEvaluacionesPorFisioterapeutaAsync(usuarioId);

            if (evaluaciones == null || evaluaciones.Count == 0)
            {
                return NotFound($"No se encontraron evaluaciones para el fisioterapeuta con ID {usuarioId}.");
            }

            return Ok(evaluaciones);
        }

        //Obtener seguimiento por evaluación    


        [HttpGet("seguimiento/{evaluacionId}")]
        public async Task<IActionResult> ObtenerSeguimientosPorEvaluacion(int evaluacionId)
        {
            var seguimientos = await _seguimientoService.ObtenerSeguimientosPorEvaluacionAsync(evaluacionId);
            return Ok(seguimientos);
        }

    }
}
