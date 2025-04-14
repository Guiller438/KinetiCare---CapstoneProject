using System;
using System.Collections.Generic;

namespace MSEvaluacionyDiagnostico.Models;

public partial class HistorialEvaluacion
{
    public int Id { get; set; }

    public int? EvaluacionId { get; set; }

    public DateTime? FechaEdicion { get; set; }

    public int? UsuarioId { get; set; }

    public virtual Evaluacion? Evaluacion { get; set; }

    public virtual Usuario? Usuario { get; set; }
}
