using System;
using System.Collections.Generic;

namespace MSGestionDeUsuariosySeguridad.Models;

public partial class TokenAcceso
{
    public int Id { get; set; }

    public int? UsuarioId { get; set; }

    public string? Token { get; set; }

    public DateTime? FechaExpiracion { get; set; }

    public bool? Revocado { get; set; }

    public virtual Usuario? Usuario { get; set; }
}
