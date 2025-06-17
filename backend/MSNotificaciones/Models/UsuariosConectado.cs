using System;
using System.Collections.Generic;

namespace MSNotificaciones.Models;

public partial class UsuariosConectado
{
    public int Id { get; set; }

    public string ReceptorId { get; set; } = null!;

    public string TipoReceptor { get; set; } = null!;

    public string ConnectionId { get; set; } = null!;

    public DateTime? FechaConexion { get; set; }
}
