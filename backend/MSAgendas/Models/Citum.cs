using System;
using System.Collections.Generic;

namespace MSAgendas.Models;

public partial class Citum
{
    public int CitaId { get; set; }

    public int PacienteId { get; set; }

    public int FisioterapeutaId { get; set; }

    public DateTime FechaHora { get; set; }

    public string Estado { get; set; } = null!;

    public string? Observaciones { get; set; }

    public DateTime? FechaCreacion { get; set; }

    public DateTime? FechaActualizacion { get; set; }

    public virtual Usuario Fisioterapeuta { get; set; } = null!;

    public virtual Paciente Paciente { get; set; } = null!;

    public virtual ICollection<ReprogramacionCitum> ReprogramacionCita { get; set; } = new List<ReprogramacionCitum>();
}
