using System;
using System.Collections.Generic;

namespace MSNotificaciones.Models;

public partial class Notificacione
{
    public int Id { get; set; }

    public string ReceptorId { get; set; } = null!;

    public string TipoReceptor { get; set; } = null!;

    public string Titulo { get; set; } = null!;

    public string Mensaje { get; set; } = null!;

    public DateTime? FechaEnvio { get; set; }

    public bool? Leido { get; set; }
}
