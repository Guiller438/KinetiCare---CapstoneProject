using Microsoft.AspNetCore.Mvc;
using MSEvaluacionyDiagnostico.DTOs;
using MSEvaluacionyDiagnostico.Interfaces;

namespace MSEvaluacionyDiagnostico.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CuestionarioController : Controller
    {
        private readonly IPreguntaService _preguntaService;
        private readonly IRespuestaService _respuestaService;

        public CuestionarioController(IPreguntaService preguntaService, IRespuestaService respuestaService)
        {
            _preguntaService = preguntaService;
            _respuestaService = respuestaService;
        }

        #region Preguntas

        [HttpPost("crearPreguntas")]

        public async Task<IActionResult> CrearPreguntas([FromBody] List<CrearPreguntaDTO> preguntas)
        {
            if (preguntas == null || preguntas.Count == 0)
            {
                return BadRequest("No se proporcionaron preguntas.");
            }
            var resultado = new List<PreguntaDTO>();
            foreach (var pregunta in preguntas)
            {
                var preguntaCreada = await _preguntaService.CrearPreguntaAsync(pregunta);
                resultado.Add(preguntaCreada);
            }
            return Ok(resultado);
        }

        [HttpGet("obtenerPreguntas")]

        public async Task<IActionResult> ObtenerPreguntas()
        {
            var preguntas = await _preguntaService.ObtenerPreguntasAsync();
            return Ok(preguntas);
        }

        [HttpGet("obtenerPreguntaPorId/{id}")]
        public async Task<IActionResult> ObtenerPreguntaPorId(int id)
        {
            var pregunta = await _preguntaService.ObtenerPreguntaPorIdAsync(id);
            if (pregunta == null)
            {
                return NotFound($"No se encontró la pregunta con ID {id}.");
            }
            return Ok(pregunta);
        }

        [HttpDelete("eliminarPregunta/{id}")]

        public async Task<IActionResult> EliminarPregunta(int id)
        {
            var resultado = await _preguntaService.EliminarPreguntaAsync(id);
            if (!resultado)
            {
                return NotFound($"No se encontró la pregunta con ID {id}.");
            }
            return NoContent();
        }

        #endregion

        #region Respuestas

        [HttpPost("crearRespuesta")]
        public async Task<IActionResult> CrearRespuesta([FromBody] CrearRespuestaDTO crearRespuestaDTO)
        {
            if (crearRespuestaDTO == null)
            {
                return BadRequest("No se proporcionó una respuesta válida.");
            }
            var respuestaCreada = await _respuestaService.CrearRespuestaAsync(crearRespuestaDTO);
            return Ok(respuestaCreada);
        }

        [HttpGet("obtenerRespuestasPorEvaluacion/{evaluacionId}")]
        public async Task<IActionResult> ObtenerRespuestasPorEvaluacion(int evaluacionId)
        {
            var respuestas = await _respuestaService.ObtenerRespuestasPorEvaluacionAsync(evaluacionId);
            if (respuestas == null || respuestas.Count == 0)
            {
                return NotFound($"No se encontraron respuestas para la evaluación con ID {evaluacionId}.");
            }
            return Ok(respuestas);
        }

        [HttpPost("crearMultiplesRespuestas")]
        public async Task<IActionResult> CrearMultiplesRespuestas([FromBody] RespuestaMultipleDTO crearRespuestasMultiplesDTO)
        {
            if (crearRespuestasMultiplesDTO == null || crearRespuestasMultiplesDTO.Respuestas == null || !crearRespuestasMultiplesDTO.Respuestas.Any())
            {
                return BadRequest("No se proporcionaron respuestas válidas.");
            }

            var respuestasCreadas = await _respuestaService.CrearMultiplesRespuestasAsync(crearRespuestasMultiplesDTO);
            return Ok(respuestasCreadas);
        }
        #endregion
    }
}
