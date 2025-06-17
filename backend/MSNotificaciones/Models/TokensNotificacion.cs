using System;
using System.Collections.Generic;

namespace MSNotificaciones.Models;

public partial class TokensNotificacion
{
    public int Id { get; set; }

    public string ReceptorId { get; set; } = null!;

    public string TipoReceptor { get; set; } = null!;

    public string Token { get; set; } = null!;

    public DateTime? FechaRegistro { get; set; }
}
