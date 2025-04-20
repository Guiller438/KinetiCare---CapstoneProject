using System;
using System.Collections.Generic;
using MSEvaluacionyDiagnostico.Models;
using Microsoft.EntityFrameworkCore;

namespace MSEvaluacionyDiagnostico.Data;

public partial class KinetiCareDbContext : DbContext
{
    public KinetiCareDbContext()
    {
    }

    public KinetiCareDbContext(DbContextOptions<KinetiCareDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Evaluacion> Evaluacions { get; set; }

    public virtual DbSet<HistorialEvaluacion> HistorialEvaluacions { get; set; }

    public virtual DbSet<Paciente> Pacientes { get; set; }

    public virtual DbSet<Preguntum> Pregunta { get; set; }

    public virtual DbSet<Respuestum> Respuesta { get; set; }

    public virtual DbSet<ResumenEvolutivo> ResumenEvolutivos { get; set; }

    public virtual DbSet<Rol> Rols { get; set; }

    public virtual DbSet<TipoPreguntum> TipoPregunta { get; set; }

    public virtual DbSet<Usuario> Usuarios { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Name=DefaultConnection");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Evaluacion>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Evaluaci__3214EC0763E9959D");

            entity.ToTable("Evaluacion");

            entity.Property(e => e.Fecha)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Observaciones).HasMaxLength(1000);

            entity.HasOne(d => d.Paciente).WithMany(p => p.Evaluacions)
                .HasForeignKey(d => d.PacienteId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Evaluacio__Pacie__5BE2A6F2");
        });

        modelBuilder.Entity<HistorialEvaluacion>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Historia__3214EC07423572B6");

            entity.ToTable("HistorialEvaluacion");

            entity.Property(e => e.FechaEdicion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Evaluacion).WithMany(p => p.HistorialEvaluacions)
                .HasForeignKey(d => d.EvaluacionId)
                .HasConstraintName("FK__Historial__Evalu__693CA210");

            entity.HasOne(d => d.Usuario).WithMany(p => p.HistorialEvaluacions)
                .HasForeignKey(d => d.UsuarioId)
                .HasConstraintName("FK__Historial__Usuar__6A30C649");
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

        modelBuilder.Entity<Preguntum>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Pregunta__3214EC076E1D0F06");

            entity.Property(e => e.Obligatoria).HasDefaultValue(true);
            entity.Property(e => e.Texto).HasMaxLength(255);

            entity.HasOne(d => d.TipoPregunta).WithMany(p => p.Pregunta)
                .HasForeignKey(d => d.TipoPreguntaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Pregunta__TipoPr__619B8048");
        });

        modelBuilder.Entity<Respuestum>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Respuest__3214EC07B227F81B");

            entity.Property(e => e.Valor).HasMaxLength(255);
            entity.Property(e => e.Sentimiento).HasMaxLength(15).IsUnicode(false);


            entity.HasOne(d => d.Evaluacion).WithMany(p => p.Respuesta)
                .HasForeignKey(d => d.EvaluacionId)
                .HasConstraintName("FK__Respuesta__Evalu__6477ECF3");

            entity.HasOne(d => d.Pregunta).WithMany(p => p.Respuesta)
                .HasForeignKey(d => d.PreguntaId)
                .HasConstraintName("FK__Respuesta__Pregu__656C112C");
        });

        modelBuilder.Entity<ResumenEvolutivo>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__ResumenE__3214EC07407AB7D7");

            entity.ToTable("ResumenEvolutivo");

            entity.Property(e => e.FechaGeneracion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Evaluacion).WithMany(p => p.ResumenEvolutivos)
                .HasForeignKey(d => d.EvaluacionId)
                .HasConstraintName("FK__ResumenEv__Evalu__6EF57B66");

            entity.HasOne(d => d.Paciente).WithMany(p => p.ResumenEvolutivos)
                .HasForeignKey(d => d.PacienteId)
                .HasConstraintName("FK__ResumenEv__Pacie__6E01572D");
        });

        modelBuilder.Entity<Rol>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Rol__3214EC07B6CC7400");

            entity.ToTable("Rol");

            entity.Property(e => e.Descripcion).HasMaxLength(250);
            entity.Property(e => e.Nombre).HasMaxLength(50);
        });

        modelBuilder.Entity<TipoPreguntum>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TipoPreg__3214EC075A1164A3");

            entity.Property(e => e.Descripcion).HasMaxLength(255);
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
