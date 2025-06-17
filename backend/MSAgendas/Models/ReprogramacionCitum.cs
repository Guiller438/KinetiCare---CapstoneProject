using System;
using System.Collections.Generic;

namespace MSAgendas.Models;

public partial class ReprogramacionCitum
{
    public int ReprogramacionId { get; set; }

    public int CitaId { get; set; }

    public DateTime FechaAnterior { get; set; }

    public DateTime FechaNueva { get; set; }

    public string? Motivo { get; set; }

    public DateTime? FechaReprogramacion { get; set; }

    public virtual Citum Cita { get; set; } = null!;
}
