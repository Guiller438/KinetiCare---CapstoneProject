from fastapi import FastAPI
from app.api.captura import router as captura_router
from fastapi.middleware.cors import CORSMiddleware
from app.Database.mongo import inicializar_dispositivos
from app.Database.mongo import inicializar_base_datos_completa




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

# ⚙️ Inicializar dispositivos y base de datos al iniciar la app
@app.on_event("startup")
def startup_event():
    print("🚀 Inicializando base de datos MongoDB...")
    inicializar_base_datos_completa()
    print("✅ Dispositivos verificados y base lista.")
    
app.include_router(captura_router)

