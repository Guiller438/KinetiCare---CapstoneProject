using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using MSGestionDeUsuariosySeguridad.Models;

namespace MSGestionDeUsuariosySeguridad.Data;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<HistorialLogin> HistorialLogins { get; set; }

    public virtual DbSet<Paciente> Pacientes { get; set; }

    public virtual DbSet<Rol> Rols { get; set; }

    public virtual DbSet<TokenAcceso> TokenAccesos { get; set; }

    public virtual DbSet<Usuario> Usuarios { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Data Source=DESKTOP-SO7UMP1\\SQLEXPRESS;Initial Catalog=KinetiCareDB;Integrated Security=True;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<HistorialLogin>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Historia__3214EC0775E79BFB");

            entity.ToTable("HistorialLogin");

            entity.Property(e => e.FechaHora).HasColumnType("datetime");
            entity.Property(e => e.Ip)
                .HasMaxLength(100)
                .HasColumnName("IP");

            entity.HasOne(d => d.Usuario).WithMany(p => p.HistorialLogins)
                .HasForeignKey(d => d.UsuarioId)
                .HasConstraintName("FK__Historial__Usuar__5535A963");
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

        modelBuilder.Entity<Rol>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Rol__3214EC07B6CC7400");

            entity.ToTable("Rol");

            entity.Property(e => e.Descripcion).HasMaxLength(250);
            entity.Property(e => e.Nombre).HasMaxLength(50);
        });

        modelBuilder.Entity<TokenAcceso>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TokenAcc__3214EC07D1E61EA1");

            entity.ToTable("TokenAcceso");

            entity.Property(e => e.FechaExpiracion).HasColumnType("datetime");
            entity.Property(e => e.Revocado).HasDefaultValue(false);

            entity.HasOne(d => d.Usuario).WithMany(p => p.TokenAccesos)
                .HasForeignKey(d => d.UsuarioId)
                .HasConstraintName("FK__TokenAcce__Usuar__52593CB8");
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
