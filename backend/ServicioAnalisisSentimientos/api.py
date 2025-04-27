from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.responses import JSONResponse
import pickle
import os

# Cargar ruta absoluta
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
modelo_path = os.path.join(BASE_DIR, "modelo_sentimientos_mejorado.pkl")

# 1. Cargar el modelo entrenado al iniciar
try:
    with open(modelo_path, 'rb') as f:
        modelo = pickle.load(f)
except FileNotFoundError:
    raise Exception("\u274c No se encontró el archivo del modelo. Asegúrate de que modelo_sentimientos_mejorado.pkl esté en la carpeta correcta.")

# 2. Inicializar FastAPI
app = FastAPI(
    title="Servicio de An\u00e1lisis de Sentimientos",
    description="API que analiza el sentimiento de un texto en espa\u00f1ol",
    version="1.0.0"
)

# 3. Definir el esquema de entrada
class TextoEntrada(BaseModel):
    texto: str

# 4. Definir el esquema de salida
class SentimientoRespuesta(BaseModel):
    sentimiento: str

# 5. Definir el endpoint principal
@app.post("/analizar", response_model=SentimientoRespuesta)
async def analizar_sentimiento(entrada: TextoEntrada):
    try:
        texto = entrada.texto.strip()
        if not texto:
            raise HTTPException(status_code=400, detail="\u26a0\ufe0f El texto no puede estar vac\u00edo.")

        sentimiento = modelo.predict([texto])[0]
        return {"sentimiento": sentimiento}

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# 6. Endpoint de bienvenida opcional (salud del API)
@app.get("/", tags=["Sistema"])
async def root():
    return {"mensaje": "\u2705 API de An\u00e1lisis de Sentimientos funcionando correctamente."}
