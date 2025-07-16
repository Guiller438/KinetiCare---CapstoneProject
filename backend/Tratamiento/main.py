from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from schemas.tratamiento import TratamientoRequest
from services.model import predecir_ejercicio, generar_recomendacion
from services.email import enviar_correo_tratamiento

app = FastAPI()

# Habilitar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ruta GET: Recomendaciones automáticas
@app.get("/recomendaciones-automaticas")
def generar_recomendacion_automatica(
    edad: int = Query(...),
    sexo: str = Query(...),
    diagnostico: str = Query(...),
    movilidad_articular: int = Query(...),
    nivel_dolor: int = Query(...),
    actividad_diaria: str = Query(...),
    sentimiento_reportado: str = Query(...)
):
    datos = {
        "edad": edad,
        "sexo": sexo,
        "diagnostico": diagnostico,
        "movilidad_articular": movilidad_articular,
        "nivel_dolor": nivel_dolor,
        "actividad_diaria": actividad_diaria,
        "sentimiento_reportado": sentimiento_reportado
    }

    ejercicio_recomendado = predecir_ejercicio(datos)

    return {
        "ejercicio1": f"Ejercicio recomendado: {ejercicio_recomendado}",
        "ejercicio2": "Estiramiento suave (2x20s)",
        "frecuencia": "3 veces por semana" if nivel_dolor < 6 else "2 veces por semana",
        "observaciones": "Monitorear al paciente durante la ejecución del tratamiento"
    }

# Ruta POST: Enviar tratamiento por correo
@app.post("/enviar-tratamiento")
def enviar_tratamiento(tratamiento: TratamientoRequest):
    entrada = {
        "edad": tratamiento.edad,
        "sexo": tratamiento.sexo,
        "diagnostico": tratamiento.diagnostico,
        "movilidad_articular": tratamiento.movilidad_articular,
        "nivel_dolor": tratamiento.nivel_dolor,
        "actividad_diaria": tratamiento.actividad_diaria,
        "sentimiento_reportado": tratamiento.sentimiento_reportado,
        "ejercicios_previos": tratamiento.ejercicios_previos
    }

    resultado = generar_recomendacion(entrada)

    cuerpo = f"""
Hola 👋

Este es el plan de tratamiento personalizado generado para usted:

🧘‍♂️ Ejercicio 1: {resultado["ejercicio1"]}
🏋️‍♀️ Ejercicio 2: {resultado["ejercicio2"]}
📆 Frecuencia sugerida: {resultado["frecuencia"]}
📝 Observaciones: {resultado["observaciones"]}

Por favor siga este plan según lo indicado por su fisioterapeuta.

— El equipo de KinetiCare
    """

    enviar_correo_tratamiento(
        destinatario=tratamiento.correo_paciente,
        asunto="📄 Recomendación de tratamiento personalizado",
        cuerpo=cuerpo
    )

    return {
        "mensaje": "✅ Tratamiento enviado correctamente al paciente.",
        "recomendaciones": resultado
    }
