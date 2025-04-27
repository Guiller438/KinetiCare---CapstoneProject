using Microsoft.EntityFrameworkCore;
using MSEvaluacionyDiagnostico.Data;
using MSEvaluacionyDiagnostico.DTOs;
using MSEvaluacionyDiagnostico.Interfaces;
using MSEvaluacionyDiagnostico.Models;
using Newtonsoft.Json;
using System.Text;

namespace MSEvaluacionyDiagnostico.Services
{
    public class RespuestaService : IRespuestaService
    {
        private readonly KinetiCareDbContext _context;
        private readonly HttpClient _httpClient; 

        public RespuestaService(KinetiCareDbContext context, HttpClient httpClient)
        {
            _context = context;
            _httpClient = httpClient;
        }

        public async Task<RespuestaDTO> CrearRespuestaAsync(CrearRespuestaDTO crearRespuestaDTO)
        {
            var sentimiento = await ObtenerSentimientoDesdeServicioPython(crearRespuestaDTO.Valor);
            if (string.IsNullOrEmpty(sentimiento))
            {
                throw new Exception("Error al obtener el sentimiento");
            }
            var respuesta = new Respuestum
            {
                EvaluacionId = crearRespuestaDTO.EvaluacionId,
                PacienteId = crearRespuestaDTO.PacienteId,
                PreguntaId = crearRespuestaDTO.PreguntaId,
                Valor = crearRespuestaDTO.Valor,
                Sentimiento = sentimiento
            };

            _context.Respuesta.Add(respuesta);
            await _context.SaveChangesAsync();

            return new RespuestaDTO
            {
                Id = respuesta.Id,
                EvaluacionId = respuesta.EvaluacionId,
                PacienteId = respuesta.PacienteId,
                PreguntaId = respuesta.PreguntaId,
                Valor = respuesta.Valor,
                Sentimiento = respuesta.Sentimiento
            };
        }

        public async Task<List<RespuestaDTO>> ObtenerRespuestasPorEvaluacionAsync(int evaluacionId)
        {
            var respuestas = await _context.Respuesta
                .Where(r => r.EvaluacionId == evaluacionId)
                .ToListAsync();

            return respuestas.Select(r => new RespuestaDTO
            {
                Id = r.Id,
                EvaluacionId = r.EvaluacionId,
                PacienteId = r.PacienteId,
                PreguntaId = r.PreguntaId,
                Valor = r.Valor,
                Sentimiento = r.Sentimiento
            }).ToList();
        }

        private async Task<string> ObtenerSentimientoDesdeServicioPython(string texto)
        {
            var contenido = new StringContent(JsonConvert.SerializeObject(new { texto }), Encoding.UTF8, "application/json");

            var respuesta = await _httpClient.PostAsync("http://localhost:8000/analizar", contenido);
            respuesta.EnsureSuccessStatusCode();

            var json = await respuesta.Content.ReadAsStringAsync();
            var resultado = JsonConvert.DeserializeObject<RespuestaSentimientoDTO>(json);

            return resultado.Sentimiento;
        }

        public async Task<List<RespuestaDTO>> CrearMultiplesRespuestasAsync(RespuestaMultipleDTO crearMultiplesDTO)
        {
            var respuestasCreadas = new List<RespuestaDTO>();

            foreach (var respuesta in crearMultiplesDTO.Respuestas)
            {
                var crearRespuestaDTO = new CrearRespuestaDTO
                {
                    EvaluacionId = crearMultiplesDTO.EvaluacionId,
                    PacienteId = crearMultiplesDTO.PacienteId,
                    PreguntaId = respuesta.PreguntaId,
                    Valor = respuesta.Valor
                };

                var respuestaCreada = await CrearRespuestaAsync(crearRespuestaDTO);
                respuestasCreadas.Add(respuestaCreada);
            }

            return respuestasCreadas;
        }


    }
}
