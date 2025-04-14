using System;
using System.Collections.Generic;

namespace MSEvaluacionyDiagnostico.Models;

public partial class Respuestum
{
    public int Id { get; set; }

    public int? EvaluacionId { get; set; }

    public int? PreguntaId { get; set; }

    public string? Valor { get; set; }

    public virtual Evaluacion? Evaluacion { get; set; }

    public virtual Preguntum? Pregunta { get; set; }
}
