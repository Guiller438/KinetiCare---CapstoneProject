using System;
using System.Collections.Generic;

namespace MSEvaluacionyDiagnostico.Models;

public partial class Respuestum
{
    public int Id { get; set; }

    public int EvaluacionId { get; set; }

    public int PacienteId { get; set; }

    public int PreguntaId { get; set; }

    public string Valor { get; set; } = null!;

    public string? Sentimiento { get; set; }

    public virtual Evaluacion Evaluacion { get; set; } = null!;

    public virtual Paciente Paciente { get; set; } = null!;

    public virtual Preguntum Pregunta { get; set; } = null!;
}
