using System;
using System.Collections.Generic;
using MSAgendas.Models;
using Microsoft.EntityFrameworkCore;

namespace MSAgendas.Data;

public partial class AgendaDbContext : DbContext
{
    public AgendaDbContext()
    {
    }

    public AgendaDbContext(DbContextOptions<AgendaDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Citum> Cita { get; set; }

    public virtual DbSet<DisponibilidadFisioterapeutum> DisponibilidadFisioterapeuta { get; set; }

    public virtual DbSet<Paciente> Pacientes { get; set; }

    public virtual DbSet<ReprogramacionCitum> ReprogramacionCita { get; set; }

    public virtual DbSet<Rol> Rols { get; set; }

    public virtual DbSet<Usuario> Usuarios { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=DESKTOP-SO7UMP1\\SQLEXPRESS;Database=KinetiCareDB;Trusted_Connection=True;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Citum>(entity =>
        {
            entity.HasKey(e => e.CitaId).HasName("PK__Cita__F0E2D9D254CE7D2A");

            entity.Property(e => e.Estado)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.FechaActualizacion).HasColumnType("datetime");
            entity.Property(e => e.FechaCreacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FechaHora).HasColumnType("datetime");

            entity.HasOne(d => d.Fisioterapeuta).WithMany(p => p.Cita)
                .HasForeignKey(d => d.FisioterapeutaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Cita_Fisio");

            entity.HasOne(d => d.Paciente).WithMany(p => p.Cita)
                .HasForeignKey(d => d.PacienteId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Cita_Paciente");
        });

        modelBuilder.Entity<DisponibilidadFisioterapeutum>(entity =>
        {
            entity.HasKey(e => e.DisponibilidadId).HasName("PK__Disponib__0300F3F4525DFC83");

            entity.Property(e => e.FechaCreacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Fisioterapeuta).WithMany(p => p.DisponibilidadFisioterapeuta)
                .HasForeignKey(d => d.FisioterapeutaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Disponibilidad_Fisio");
        });

        modelBuilder.Entity<Paciente>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Paciente__3214EC075F616A5A");

            entity.ToTable("Paciente");

            entity.Property(e => e.Apellidos).HasMaxLength(100);
            entity.Property(e => e.Diagnostico).HasMaxLength(500);
            entity.Property(e => e.Nombres).HasMaxLength(100);
            entity.Property(e => e.Sexo)
                .HasMaxLength(1)
                .IsUnicode(false)
                .IsFixedLength();

            entity.HasOne(d => d.Fisioterapeuta).WithMany(p => p.Pacientes)
                .HasForeignKey(d => d.FisioterapeutaId)
                .HasConstraintName("FK__Paciente__Fisiot__5812160E");
        });

        modelBuilder.Entity<ReprogramacionCitum>(entity =>
        {
            entity.HasKey(e => e.ReprogramacionId).HasName("PK__Reprogra__AB3DAFC37BF9E02D");

            entity.Property(e => e.FechaAnterior).HasColumnType("datetime");
            entity.Property(e => e.FechaNueva).HasColumnType("datetime");
            entity.Property(e => e.FechaReprogramacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Cita).WithMany(p => p.ReprogramacionCita)
                .HasForeignKey(d => d.CitaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Reprogramacion_Cita");
        });

        modelBuilder.Entity<Rol>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Rol__3214EC07B6CC7400");

            entity.ToTable("Rol");

            entity.Property(e => e.Descripcion).HasMaxLength(250);
            entity.Property(e => e.Nombre).HasMaxLength(50);
        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Usuario__3214EC073F315D30");

            entity.ToTable("Usuario");

            entity.HasIndex(e => e.Correo, "UQ__Usuario__60695A19BAD9EB0B").IsUnique();

            entity.Property(e => e.Activo).HasDefaultValue(true);
            entity.Property(e => e.ContrasenaHasheada).HasMaxLength(255);
            entity.Property(e => e.Correo).HasMaxLength(100);
            entity.Property(e => e.FechaCreacion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Nombre).HasMaxLength(100);

            entity.HasOne(d => d.Rol).WithMany(p => p.Usuarios)
                .HasForeignKey(d => d.RolId)
                .HasConstraintName("FK__Usuario__RolId__4E88ABD4");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
