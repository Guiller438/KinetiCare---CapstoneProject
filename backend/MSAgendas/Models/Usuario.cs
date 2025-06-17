using System;
using System.Collections.Generic;

namespace MSAgendas.Models;

public partial class Usuario
{
    public int Id { get; set; }

    public string? Nombre { get; set; }

    public string? Correo { get; set; }

    public string? ContrasenaHasheada { get; set; }

    public int? RolId { get; set; }

    public bool? Activo { get; set; }

    public DateTime? FechaCreacion { get; set; }

    public virtual ICollection<Citum> Cita { get; set; } = new List<Citum>();

    public virtual ICollection<DisponibilidadFisioterapeutum> DisponibilidadFisioterapeuta { get; set; } = new List<DisponibilidadFisioterapeutum>();

    public virtual ICollection<Paciente> Pacientes { get; set; } = new List<Paciente>();

    public virtual Rol? Rol { get; set; }
}
