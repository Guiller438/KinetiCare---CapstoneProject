using System;
using System.Collections.Generic;

namespace MSEvaluacionyDiagnostico.Models;

public partial class Preguntum
{
    public int Id { get; set; }

    public string Texto { get; set; } = null!;

    public virtual ICollection<Respuestum> Respuesta { get; set; } = new List<Respuestum>();

    public virtual ICollection<RespuestaSeguimiento> RespuestaSeguimientos { get; set; } = new List<RespuestaSeguimiento>();
}
