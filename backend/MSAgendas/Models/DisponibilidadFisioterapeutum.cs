using System;
using System.Collections.Generic;

namespace MSAgendas.Models;

public partial class DisponibilidadFisioterapeutum
{
    public int DisponibilidadId { get; set; }

    public int FisioterapeutaId { get; set; }

    public int DiaSemana { get; set; }

    public TimeOnly HoraInicio { get; set; }

    public TimeOnly HoraFin { get; set; }

    public DateTime? FechaCreacion { get; set; }

    public virtual Usuario Fisioterapeuta { get; set; } = null!;
}
