using System;
using System.Collections.Generic;

namespace MSEvaluacionyDiagnostico.Models;

public partial class Preguntum
{
    public int Id { get; set; }

    public string Texto { get; set; } = null!;

    public int TipoPreguntaId { get; set; }

    public bool? Obligatoria { get; set; }

    public virtual ICollection<Respuestum> Respuesta { get; set; } = new List<Respuestum>();

    public virtual TipoPreguntum TipoPregunta { get; set; } = null!;
}
