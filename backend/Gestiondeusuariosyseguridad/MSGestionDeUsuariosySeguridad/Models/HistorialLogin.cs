using System;
using System.Collections.Generic;

namespace MSGestionDeUsuariosySeguridad.Models;

public partial class HistorialLogin
{
    public int Id { get; set; }

    public int? UsuarioId { get; set; }

    public string? Ip { get; set; }

    public DateTime? FechaHora { get; set; }

    public bool? Exitoso { get; set; }

    public virtual Usuario? Usuario { get; set; }
}
