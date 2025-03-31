CREATE DATABASE KinetiCareDB;
GO

USE KinetiCareDB;
----------- Microservicio gestión de usuarios y seguridad ----------- 
CREATE TABLE Rol (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(50) NOT NULL,
    Descripcion NVARCHAR(250)
);

CREATE TABLE Usuario (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100),
    Correo NVARCHAR(100) UNIQUE,
    ContraseñaHasheada NVARCHAR(255),
    RolId INT,
    Activo BIT DEFAULT 1,
    FechaCreacion DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (RolId) REFERENCES Rol(Id)
);

CREATE TABLE TokenAcceso (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UsuarioId INT,
    Token NVARCHAR(500),
    FechaExpiracion DATETIME,
    Revocado BIT DEFAULT 0,
    FOREIGN KEY (UsuarioId) REFERENCES Usuario(Id)
);

CREATE TABLE HistorialLogin (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UsuarioId INT,
    IP NVARCHAR(100),
    FechaHora DATETIME,
    Exitoso BIT,
    FOREIGN KEY (UsuarioId) REFERENCES Usuario(Id)
);

----------- Módulo de evaluación y diagnostíco ----------- 

CREATE TABLE Paciente (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Nombres NVARCHAR(100),
    Apellidos NVARCHAR(100),
    Edad INT,
    Sexo CHAR(1),
    Diagnostico NVARCHAR(500),
    FisioterapeutaId INT,
    FOREIGN KEY (FisioterapeutaId) REFERENCES Usuario(Id)
);

CREATE TABLE Evaluacion (
    Id INT PRIMARY KEY IDENTITY(1,1),
    PacienteId INT NOT NULL,
    Fecha DATETIME NOT NULL DEFAULT GETDATE(),
    ValorX FLOAT,  -- Valor numérico eje X (por ejemplo, flexión)
    ValorY FLOAT,  -- Valor numérico eje Y (por ejemplo, extensión)
    ValorZ FLOAT,  -- Valor numérico eje Z (por ejemplo, rotación)
    Observaciones NVARCHAR(1000),
    FOREIGN KEY (PacienteId) REFERENCES Paciente(Id)
);

CREATE TABLE TipoPregunta (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(50) NOT NULL,      -- Ej: Escala, Texto, Opción múltiple
    Descripcion NVARCHAR(255) NULL
);


CREATE TABLE Pregunta (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Texto NVARCHAR(255) NOT NULL,
    TipoPreguntaId INT NOT NULL,
    Obligatoria BIT DEFAULT 1,
    FOREIGN KEY (TipoPreguntaId) REFERENCES TipoPregunta(Id)
);


CREATE TABLE Respuesta (
    Id INT PRIMARY KEY IDENTITY(1,1),
    EvaluacionId INT,
    PreguntaId INT,
    Valor NVARCHAR(255),
    FOREIGN KEY (EvaluacionId) REFERENCES Evaluacion(Id),
    FOREIGN KEY (PreguntaId) REFERENCES Pregunta(Id)
);

CREATE TABLE HistorialEvaluacion (
    Id INT PRIMARY KEY IDENTITY(1,1),
    EvaluacionId INT,
    FechaEdicion DATETIME DEFAULT GETDATE(),
    UsuarioId INT,
    FOREIGN KEY (EvaluacionId) REFERENCES Evaluacion(Id),
    FOREIGN KEY (UsuarioId) REFERENCES Usuario(Id)
);

CREATE TABLE ResumenEvolutivo (
    Id INT PRIMARY KEY IDENTITY(1,1),
    PacienteId INT,
    EvaluacionId INT,
    RangoMejoraX FLOAT,
    RangoMejoraY FLOAT,
    RangoMejoraZ FLOAT,
    FechaGeneracion DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (PacienteId) REFERENCES Paciente(Id),
    FOREIGN KEY (EvaluacionId) REFERENCES Evaluacion(Id)
);

----------- Módulo de recomendaciones ----------- 

CREATE TABLE Recomendacion (
    Id INT PRIMARY KEY IDENTITY(1,1),
    EvaluacionId INT NOT NULL,
    Tipo NVARCHAR(50),            -- Ej: "Ejercicio", "Estiramiento", "Educación"
    Descripcion NVARCHAR(1000),   -- Detalle de la sugerencia clínica
    GeneradaAutomaticamente BIT DEFAULT 1,
    AprobadaPorFisioterapeuta BIT DEFAULT 0,
    FechaSugerencia DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (EvaluacionId) REFERENCES Evaluacion(Id)
);

CREATE TABLE ClasificacionRecomendacion (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(100),         -- Ej: "Movilidad", "Fuerza", "Postura"
    Descripcion NVARCHAR(255)
);

ALTER TABLE Recomendacion
ADD ClasificacionId INT NULL,
    FOREIGN KEY (ClasificacionId) REFERENCES ClasificacionRecomendacion(Id);


CREATE TABLE SeguimientoRecomendacion (
    Id INT PRIMARY KEY IDENTITY(1,1),
    RecomendacionId INT NOT NULL,
    Fecha DATETIME DEFAULT GETDATE(),
    Estado NVARCHAR(50),          -- Ej: "Pendiente", "En proceso", "Cumplida", "Rechazada"
    Comentarios NVARCHAR(1000),
    FOREIGN KEY (RecomendacionId) REFERENCES Recomendacion(Id)
);

----------- Módulo de notificaciones y seguimiento ----------- 

CREATE TABLE Notificacion (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UsuarioId INT NOT NULL,                  -- Fisioterapeuta que recibe la alerta
    PacienteId INT NULL,                     -- Opcional: alerta puede o no estar asociada a paciente
    Tipo NVARCHAR(50),                       -- Ej: "Baja adherencia", "Seguimiento pendiente"
    Mensaje NVARCHAR(500),
    FechaEnvio DATETIME DEFAULT GETDATE(),
    Leida BIT DEFAULT 0,
    FOREIGN KEY (UsuarioId) REFERENCES Usuario(Id),
    FOREIGN KEY (PacienteId) REFERENCES Paciente(Id)
);

CREATE TABLE EventoSeguimiento (
    Id INT PRIMARY KEY IDENTITY(1,1),
    PacienteId INT,
    TipoEvento NVARCHAR(100),               -- Ej: "Evaluación pendiente", "Inactividad", "Cambio clínico"
    Fecha DATETIME DEFAULT GETDATE(),
    GeneradoPorSistema BIT DEFAULT 1,
    Importancia NVARCHAR(20),               -- Ej: "Alta", "Media", "Baja"
    Comentarios NVARCHAR(500),
    FOREIGN KEY (PacienteId) REFERENCES Paciente(Id)
);

CREATE TABLE ConfiguracionNotificacion (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UsuarioId INT,
    TipoNotificacion NVARCHAR(50),
    Frecuencia NVARCHAR(20),               -- Ej: "Diaria", "Semanal", "Mensual"
    Activa BIT DEFAULT 1,
    FOREIGN KEY (UsuarioId) REFERENCES Usuario(Id)
);

----------- Módulo de auditoría ----------- 

CREATE TABLE ConfiguracionSistema (
    Id INT PRIMARY KEY IDENTITY(1,1),
    Clave NVARCHAR(100) NOT NULL,         -- Ej: "TiempoSesionInactiva", "RutaReportesPDF"
    Valor NVARCHAR(255) NOT NULL,         -- Ej: "30", "C:\Reportes"
    Descripcion NVARCHAR(500) NULL
);

CREATE TABLE LogSistema (
    Id INT PRIMARY KEY IDENTITY(1,1),
    UsuarioId INT NULL,                      -- Puede ser NULL si fue acción del sistema
    Accion NVARCHAR(100),                    -- Ej: "Actualizó evaluación", "Generó reporte"
    EntidadAfectada NVARCHAR(100),           -- Ej: "Evaluacion", "Paciente", "Recomendacion"
    Fecha DATETIME DEFAULT GETDATE(),
    Detalles NVARCHAR(MAX),                  -- JSON, descripción, valores antiguos/nuevos
    FOREIGN KEY (UsuarioId) REFERENCES Usuario(Id)
);

CREATE TABLE MantenimientoSistema (
    Id INT PRIMARY KEY IDENTITY(1,1),
    FechaInicio DATETIME,
    FechaFin DATETIME,
    RealizadoPor INT,
    Comentario NVARCHAR(500),
    FOREIGN KEY (RealizadoPor) REFERENCES Usuario(Id)
);
