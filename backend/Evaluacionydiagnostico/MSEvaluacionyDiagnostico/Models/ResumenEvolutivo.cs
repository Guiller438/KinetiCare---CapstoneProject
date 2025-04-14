using System;
using System.Collections.Generic;

namespace MSEvaluacionyDiagnostico.Models;

public partial class ResumenEvolutivo
{
    public int Id { get; set; }

    public int? PacienteId { get; set; }

    public int? EvaluacionId { get; set; }

    public double? RangoMejoraX { get; set; }

    public double? RangoMejoraY { get; set; }

    public double? RangoMejoraZ { get; set; }

    public DateTime? FechaGeneracion { get; set; }

    public virtual Evaluacion? Evaluacion { get; set; }

    public virtual Paciente? Paciente { get; set; }
}
