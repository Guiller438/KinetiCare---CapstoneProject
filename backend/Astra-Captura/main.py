from fastapi import FastAPI
from app.api.captura import router as captura_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="KinetiCare - Astra Microservicio",
    description="Servicio para capturar y mostrar imágenes de la cámara Orbbec Astra",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cambia esto a los dominios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(captura_router)
import cv2

