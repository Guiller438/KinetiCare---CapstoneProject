from pymongo import MongoClient
from bson.objectid import ObjectId
import datetime

# 🌐 Conexión a MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["kineticare"]

# Referencias a colecciones
dispositivos = db["dispositivos"]
sesiones_evaluacion = db["sesiones_evaluacion"]

# 📌 Inicializar dispositivos (si no existen)
def inicializar_dispositivos():
    if dispositivos.count_documents({"modelo": "Astra S"}) == 0:
        dispositivos.insert_one({
            "modelo": "Astra S",
            "tipo": "Orbbec",
            "resolucion": "1280x720",
            "fps": 30,
            "numero_serie": "ASTRA-001",
            "ubicacion": "Sala Terapia 1",
            "activo": True,
            "notas": "Usado para ejercicios de pie y movilidad general."
        })

    if dispositivos.count_documents({"modelo": "Kinect Azure"}) == 0:
        dispositivos.insert_one({
            "modelo": "Kinect Azure",
            "tipo": "Microsoft",
            "resolucion": "1920x1080",
            "fps": 30,
            "numero_serie": "KINECT-001",
            "ubicacion": "Sala Terapia 2",
            "activo": True,
            "notas": "Alta precisión para seguimiento de articulaciones."
        })

# 🔎 Obtener dispositivo por modelo
def obtener_dispositivo_id(modelo: str):
    dispositivo = dispositivos.find_one({"modelo": modelo})
    return dispositivo["_id"] if dispositivo else None

# 💾 Guardar una evaluación completa con todas las capturas
def guardar_sesion_evaluacion(evaluacion_id: int, usuario_id: int, capturas: list, fecha_inicio=None, fecha_fin=None, anotaciones=""):
    dispositivo_id = obtener_dispositivo_id("Astra S")
    if not dispositivo_id:
        raise ValueError("Dispositivo Astra S no registrado.")

    documento = {
        "evaluacion_id": evaluacion_id,
        "usuario_id": usuario_id,
        "fecha_inicio": fecha_inicio or datetime.datetime.now(),
        "fecha_fin": fecha_fin or datetime.datetime.now(),
        "dispositivo_id": ObjectId(dispositivo_id),
        "anotaciones": anotaciones,
        "capturas": capturas  # lista de diccionarios con datos de cada frame
    }

    resultado = sesiones_evaluacion.insert_one(documento)
    return str(resultado.inserted_id)

# 🚀 Inicialización completa de la base de datos
def inicializar_base_datos_completa():
    inicializar_dispositivos()

    if sesiones_evaluacion.count_documents({}) == 0:
        print("🧪 Insertando sesión de evaluación de prueba para crear la colección...")

        capturas = [
            {
                "timestamp": datetime.datetime.now(),
                "rgb_base64": "base64_dummy",
                "depth_map": [[1000, 1010], [995, 1002]],
                "perfil_vertical_mm": [1001, 1002],
                "media_distancia_mm": 1001.5,
                "silueta_binaria": [[0, 1], [1, 1]]
            }
        ]

        guardar_sesion_evaluacion(
            evaluacion_id=9999,
            usuario_id=999,
            capturas=capturas,
            anotaciones="Evaluación de prueba automática generada al iniciar la base."
        )

        print("✅ Sesión de prueba insertada. La colección 'sesiones_evaluacion' ya está disponible.")
    else:
        print("📁 La colección 'sesiones_evaluacion' ya tiene documentos.")
