using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace MSEvaluacionyDiagnostico.Models;

public partial class Paciente
{
    public int Id { get; set; }

    public string? Nombres { get; set; }

    public string? Apellidos { get; set; }

    public DateTime? FechaNacimiento { get; set; }

    public string? Sexo { get; set; }

    public string? Diagnostico { get; set; }

    public int? FisioterapeutaId { get; set; }

    [NotMapped]
    public int Edad => FechaNacimiento.HasValue
    ? (int)((DateTime.Now - FechaNacimiento.Value).TotalDays / 365.25)
    : 0;


    public virtual ICollection<Evaluacion> Evaluacions { get; set; } = new List<Evaluacion>();

    public virtual Usuario? Fisioterapeuta { get; set; }

    public virtual ICollection<ResumenEvolutivo> ResumenEvolutivos { get; set; } = new List<ResumenEvolutivo>();
}
