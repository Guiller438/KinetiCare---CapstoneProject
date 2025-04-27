using System;
using System.Collections.Generic;

namespace MSEvaluacionyDiagnostico.Models;

public partial class Respuestum
{
    public int Id { get; set; }
    public int EvaluacionId { get; set; }
    public int PacienteId { get; set; }
    public int PreguntaId { get; set; }
    public string Valor { get; set; } = null!; // Texto escrito por el paciente
    public string? Sentimiento { get; set; } // Resultado del análisis de sentimiento

    // Relaciones de navegación
    public Evaluacion Evaluacion { get; set; } = null!;
    public Paciente Paciente { get; set; } = null!;
    public Preguntum Preguntum { get; set; } = null!;
}
