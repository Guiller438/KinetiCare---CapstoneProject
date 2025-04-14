using System;
using System.Collections.Generic;

namespace MSEvaluacionyDiagnostico.Models;

public partial class Evaluacion
{
    public int Id { get; set; }

    public int PacienteId { get; set; }

    public DateTime Fecha { get; set; }

    public double? ValorX { get; set; }

    public double? ValorY { get; set; }

    public double? ValorZ { get; set; }

    public string? Observaciones { get; set; }

    public virtual ICollection<HistorialEvaluacion> HistorialEvaluacions { get; set; } = new List<HistorialEvaluacion>();

    public virtual Paciente Paciente { get; set; } = null!;

    public virtual ICollection<Respuestum> Respuesta { get; set; } = new List<Respuestum>();

    public virtual ICollection<ResumenEvolutivo> ResumenEvolutivos { get; set; } = new List<ResumenEvolutivo>();
}
