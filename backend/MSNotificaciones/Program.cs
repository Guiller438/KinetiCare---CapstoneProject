using Microsoft.EntityFrameworkCore;
using MSNotificaciones.Data;
using MSNotificaciones.Interfaces;
using MSNotificaciones.Services;
using Microsoft.AspNetCore.SignalR;
using MSNotificaciones.Hubs;

var builder = WebApplication.CreateBuilder(args);

// -----------------------------
// 🔧 CONFIGURACIÓN DE SERVICIOS
// -----------------------------
builder.Services.AddDbContext<NotificacionesDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddSignalR();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<IWhatsappService, WhatsappService>();
builder.Services.AddHttpClient();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ✅ CORS para permitir conexión desde React (localhost:5173)
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // obligatorio para SignalR
    });
});

var app = builder.Build();

// -----------------------------
// 🔧 MIDDLEWARES EN ORDEN CORRECTO
// -----------------------------
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();     // 🟢 Primero
app.UseCors();        // 🟢 Luego
app.UseAuthorization(); // (solo si tienes decoradores [Authorize], si no, lo puedes quitar)

// ✅ Aquí se mapean los endpoints correctamente
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers(); // API REST
    endpoints.MapHub<NotificacionesHub>("/hub/notificaciones"); // SignalR
});

app.Run();
