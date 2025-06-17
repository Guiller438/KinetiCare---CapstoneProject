using System;
using System.Collections.Generic;
using MSNotificaciones.Models;
using Microsoft.EntityFrameworkCore;

namespace MSNotificaciones.Data;

public partial class NotificacionesDbContext : DbContext
{
    public NotificacionesDbContext()
    {
    }

    public NotificacionesDbContext(DbContextOptions<NotificacionesDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Notificacione> Notificaciones { get; set; }

    public virtual DbSet<TokensNotificacion> TokensNotificacions { get; set; }

    public virtual DbSet<UsuariosConectado> UsuariosConectados { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=DESKTOP-SO7UMP1\\SQLEXPRESS;Database=KinetiCareDB;Trusted_Connection=True;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Notificacione>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Notifica__3214EC077D4C6426");

            entity.Property(e => e.FechaEnvio)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Leido).HasDefaultValue(false);
            entity.Property(e => e.Mensaje).HasMaxLength(1000);
            entity.Property(e => e.ReceptorId).HasMaxLength(100);
            entity.Property(e => e.TipoReceptor).HasMaxLength(20);
            entity.Property(e => e.Titulo).HasMaxLength(255);
        });

        modelBuilder.Entity<TokensNotificacion>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TokensNo__3214EC07B409B05F");

            entity.ToTable("TokensNotificacion");

            entity.Property(e => e.FechaRegistro)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ReceptorId).HasMaxLength(100);
            entity.Property(e => e.TipoReceptor).HasMaxLength(20);
            entity.Property(e => e.Token).HasMaxLength(500);
        });

        modelBuilder.Entity<UsuariosConectado>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Usuarios__3214EC071CED4E3C");

            entity.Property(e => e.ConnectionId).HasMaxLength(100);
            entity.Property(e => e.FechaConexion)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ReceptorId).HasMaxLength(100);
            entity.Property(e => e.TipoReceptor).HasMaxLength(20);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
