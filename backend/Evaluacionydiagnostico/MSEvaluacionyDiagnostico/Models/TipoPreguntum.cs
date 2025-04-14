using System;
using System.Collections.Generic;

namespace MSEvaluacionyDiagnostico.Models;

public partial class TipoPreguntum
{
    public int Id { get; set; }

    public string Nombre { get; set; } = null!;

    public string? Descripcion { get; set; }

    public virtual ICollection<Preguntum> Pregunta { get; set; } = new List<Preguntum>();
}
