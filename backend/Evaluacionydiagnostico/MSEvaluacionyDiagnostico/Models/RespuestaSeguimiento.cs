using System;
using System.Collections.Generic;

namespace MSEvaluacionyDiagnostico.Models;

public partial class RespuestaSeguimiento
{
    public int Id { get; set; }

    public int SeguimientoId { get; set; }

    public int PreguntaId { get; set; }

    public string Valor { get; set; } = null!;

    public string? Sentimiento { get; set; }

    public virtual Preguntum Pregunta { get; set; } = null!;

    public virtual Seguimiento Seguimiento { get; set; } = null!;
}
