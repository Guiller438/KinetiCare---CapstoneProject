using System;
using System.Collections.Generic;

namespace MSAgendas.Models;

public partial class Paciente
{
    public int Id { get; set; }

    public string? Nombres { get; set; }

    public string? Apellidos { get; set; }

    public string? Sexo { get; set; }

    public string? Diagnostico { get; set; }

    public int? FisioterapeutaId { get; set; }

    public DateOnly? FechaNacimiento { get; set; }

    public virtual ICollection<Citum> Cita { get; set; } = new List<Citum>();

    public virtual Usuario? Fisioterapeuta { get; set; }
}
