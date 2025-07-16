using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using MSEvaluacionyDiagnostico.Models;

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

    public virtual DbSet<RespuestaSeguimiento> RespuestaSeguimientos { get; set; }

    public virtual DbSet<Respuestum> Respuesta { get; set; }

    public virtual DbSet<ResumenEvolutivo> ResumenEvolutivos { get; set; }

    public virtual DbSet<Rol> Rols { get; set; }

    public virtual DbSet<Seguimiento> Seguimientos { get; set; }

    public virtual DbSet<Usuario> Usuarios { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Data Source=DESKTOP-SO7UMP1\\SQLEXPRESS;Initial Catalog=KinetiCareDB;Integrated Security=True;TrustServerCertificate=True;");

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
            entity.Property(e => e.CorreoElectronico).HasMaxLength(100);

            entity.HasOne(d => d.Fisioterapeuta).WithMany(p => p.Pacientes)
                .HasForeignKey(d => d.FisioterapeutaId)
                .HasConstraintName("FK__Paciente__Fisiot__5812160E");
        });

        modelBuilder.Entity<Preguntum>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Pregunta__3214EC07D17474DB");
        });

        modelBuilder.Entity<RespuestaSeguimiento>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Respuest__3214EC07E1FE9084");

            entity.ToTable("RespuestaSeguimiento");

            entity.Property(e => e.Sentimiento).HasMaxLength(50);

            entity.HasOne(d => d.Pregunta).WithMany(p => p.RespuestaSeguimientos)
                .HasForeignKey(d => d.PreguntaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Respuesta__Pregu__41EDCAC5");

            entity.HasOne(d => d.Seguimiento).WithMany(p => p.RespuestaSeguimientos)
                .HasForeignKey(d => d.SeguimientoId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Respuesta__Segui__40F9A68C");
        });

        modelBuilder.Entity<Respuestum>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Respuest__3214EC07480EBC6A");

            entity.Property(e => e.Sentimiento).HasMaxLength(50);

            entity.HasOne(d => d.Evaluacion).WithMany(p => p.Respuesta)
                .HasForeignKey(d => d.EvaluacionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Respuesta__Evalu__2EDAF651");

            entity.HasOne(d => d.Paciente).WithMany(p => p.Respuestas)
                .HasForeignKey(d => d.PacienteId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Respuesta__Pacie__2FCF1A8A");

            entity.HasOne(d => d.Pregunta).WithMany(p => p.Respuesta)
                .HasForeignKey(d => d.PreguntaId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Respuesta__Pregu__30C33EC3");
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

        modelBuilder.Entity<Seguimiento>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Seguimie__3214EC07E5D8FB76");

            entity.ToTable("Seguimiento");

            entity.Property(e => e.Fecha)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ValorX).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.ValorY).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.ValorZ).HasColumnType("decimal(10, 2)");

            entity.HasOne(d => d.Evaluacion).WithMany(p => p.Seguimientos)
                .HasForeignKey(d => d.EvaluacionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Seguimien__Evalu__3D2915A8");

            entity.HasOne(d => d.Usuario).WithMany(p => p.Seguimientos)
                .HasForeignKey(d => d.UsuarioId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Seguimien__Usuar__3E1D39E1");
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
