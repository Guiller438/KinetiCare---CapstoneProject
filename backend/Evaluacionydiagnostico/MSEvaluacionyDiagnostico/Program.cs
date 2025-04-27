using Microsoft.EntityFrameworkCore;
using MSEvaluacionyDiagnostico.Data;
using MSEvaluacionyDiagnostico.Interfaces;
using MSEvaluacionyDiagnostico.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<KinetiCareDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

//Registro de los servicios
builder.Services.AddScoped<IPacienteService, PacienteService>();
builder.Services.AddScoped<IPreguntaService, PreguntaService>();
builder.Services.AddHttpClient<IRespuestaService, RespuestaService>();


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.UseCors("AllowAll");

app.Run();
