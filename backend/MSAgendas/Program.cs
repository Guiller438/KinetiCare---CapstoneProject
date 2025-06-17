using Microsoft.EntityFrameworkCore;
using MSAgendas.Data;
using MSAgendas.Interfaces;
using MSAgendas.Services;

var builder = WebApplication.CreateBuilder(args);

// ✅ Cadena de conexión desde appsettings.json
builder.Services.AddDbContext<AgendaDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ✅ Inyectar el servicio de citas
builder.Services.AddScoped<ICitaService, CitaService>();
builder.Services.AddScoped<IDisponibilidadService, DisponibilidadService>();


// ✅ Swagger y controladores
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ✅ (Opcional) CORS para frontend en React
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:7000") // o el puerto de tu frontend
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// 🔧 Configuración del pipeline HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseRouting();
app.UseCors(); //Habilitar CORS

app.UseAuthorization();

app.MapControllers();

app.Run();
