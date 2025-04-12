using System;
using System.Collections.Generic;

namespace MSGestionDeUsuariosySeguridad.Models;

public partial class Paciente
{
    public int Id { get; set; }

    public string? Nombres { get; set; }

    public string? Apellidos { get; set; }

    public int? Edad { get; set; }

    public string? Sexo { get; set; }

    public string? Diagnostico { get; set; }

    public int? FisioterapeutaId { get; set; }

    public virtual Usuario? Fisioterapeuta { get; set; }
}
