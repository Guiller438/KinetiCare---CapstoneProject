using System;
using System.Collections.Generic;

namespace MSEvaluacionyDiagnostico.Models;

public partial class Seguimiento
{
    public int Id { get; set; }

    public int EvaluacionId { get; set; }

    public int UsuarioId { get; set; }

    public DateTime Fecha { get; set; }

    public decimal? ValorX { get; set; }

    public decimal? ValorY { get; set; }

    public decimal? ValorZ { get; set; }

    public string? Observaciones { get; set; }

    public virtual Evaluacion Evaluacion { get; set; } = null!;

    public virtual ICollection<RespuestaSeguimiento> RespuestaSeguimientos { get; set; } = new List<RespuestaSeguimiento>();

    public virtual Usuario Usuario { get; set; } = null!;
}
