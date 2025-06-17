using MSEvaluacionyDiagnostico.Data;
using MSEvaluacionyDiagnostico.DTOs;
using MSEvaluacionyDiagnostico.Interfaces;
using MSEvaluacionyDiagnostico.Models;
using Newtonsoft.Json;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace MSEvaluacionyDiagnostico.Services
{
    public class SeguimientoService : ISeguimientoService
    {
        private readonly KinetiCareDbContext _context;

        public SeguimientoService(KinetiCareDbContext context)
        {
            _context = context;
        }

        public async Task<int> CrearSeguimientoAsync(CrearSeguimientoDTO dto)
        {
            var seguimiento = new Seguimiento
            {
                EvaluacionId = dto.EvaluacionId,
                UsuarioId = dto.UsuarioId,
                Fecha = DateTime.Now,
                ValorX = dto.ValorX,
                ValorY = dto.ValorY,
                ValorZ = dto.ValorZ,
                Observaciones = dto.Observaciones
            };

            _context.Seguimientos.Add(seguimiento);
            await _context.SaveChangesAsync();

            if (dto.Respuestas != null && dto.Respuestas.Any())
            {
                await CrearMultiplesRespuestasAsync(seguimiento.Id, dto.Respuestas);
            }

            return seguimiento.Id;
        }

        public async Task<IEnumerable<Seguimiento>> ObtenerSeguimientosPorEvaluacionAsync(int evaluacionId)
        {
            return await _context.Seguimientos
                .Where(s => s.EvaluacionId == evaluacionId)
                .OrderByDescending(s => s.Fecha)
                .ToListAsync();
        }

        public async Task CrearMultiplesRespuestasAsync(int seguimientoId, List<RespuestaSeguimientoDTO> respuestas)
        {
            var respuestasAInsertar = new List<RespuestaSeguimiento>();

            foreach (var r in respuestas)
            {
                var sentimiento = await ObtenerSentimientoDesdeServicioPython(r.Valor);

                respuestasAInsertar.Add(new RespuestaSeguimiento
                {
                    SeguimientoId = seguimientoId,
                    PreguntaId = r.PreguntaId,
                    Valor = r.Valor,
                    Sentimiento = sentimiento
                });
            }

            _context.RespuestaSeguimientos.AddRange(respuestasAInsertar);
            await _context.SaveChangesAsync();
        }

        private async Task<string> ObtenerSentimientoDesdeServicioPython(string texto)
        {
            var contenido = new StringContent(
                JsonConvert.SerializeObject(new { texto }),
                Encoding.UTF8,
                "application/json"
            );

            using var httpClient = new HttpClient();
            var respuesta = await httpClient.PostAsync("http://localhost:8000/analizar", contenido);
            respuesta.EnsureSuccessStatusCode();

            var json = await respuesta.Content.ReadAsStringAsync();
            var resultado = JsonConvert.DeserializeObject<RespuestaSentimientoDTO>(json);

            return resultado?.Sentimiento ?? "neutral";
        }
    }
}
