from fastapi import APIRouter, Response, HTTPException
from fastapi.responses import StreamingResponse
from app.services.astra_camera import astra_service
from app.utils.image_encoder import encode_frame_to_jpeg
from app.Database.mongo import guardar_sesion_evaluacion

import time
from datetime import datetime

router = APIRouter(prefix="/astra", tags=["Captura Astra"])

# 🔴 Captura manual
@router.post("/captura", summary="Captura manual de una imagen RGB y profundidad")
def capturar_imagen_unica():
    if astra_service is None:
        raise HTTPException(status_code=503, detail="Dispositivo Astra no disponible.")
    try:
        data = astra_service.tomar_captura()
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al capturar imagen: {str(e)}")

# 🟢 Captura automática de sesión
@router.post("/sesion-evaluacion", summary="Captura progresiva de sesión y guarda en MongoDB")
def capturar_sesion_completa(
    evaluacion_id: int,
    usuario_id: int,
    cantidad_capturas: int = 10,
    intervalo_segundos: float = 1.0,
    anotaciones: str = ""
):
    if astra_service is None:
        raise HTTPException(status_code=503, detail="Dispositivo Astra no disponible.")
    try:
        capturas = []
        for _ in range(cantidad_capturas):
            capturas.append(astra_service.tomar_captura())
            time.sleep(intervalo_segundos)

        id_guardado = guardar_sesion_evaluacion(
            evaluacion_id=evaluacion_id,
            usuario_id=usuario_id,
            capturas=capturas,
            fecha_inicio=capturas[0]["timestamp"],
            fecha_fin=capturas[-1]["timestamp"],
            anotaciones=anotaciones
        )

        return {"mensaje": "Sesión registrada exitosamente", "id": id_guardado}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error durante la sesión: {str(e)}")

# 🎥 Stream RGB MJPEG
@router.get("/stream-rgb-mjpeg", summary="Stream MJPEG RGB en tiempo real")
def stream_rgb_mjpeg():
    if astra_service is None or not astra_service.rgb_available:
        return Response(content="RGB no disponible", status_code=503)

    def generate():
        while True:
            try:
                frame = astra_service.get_rgb_frame()
                jpeg = encode_frame_to_jpeg(frame)
                yield (
                    b"--frame\r\n"
                    b"Content-Type: image/jpeg\r\n\r\n" + jpeg + b"\r\n"
                )
            except Exception as e:
                print(f"❌ Error en stream RGB MJPEG: {e}")
                break

    return StreamingResponse(generate(), media_type="multipart/x-mixed-replace; boundary=frame")

# 🎥 Stream profundidad MJPEG
@router.get("/stream-depth-mjpeg", summary="Stream MJPEG en tiempo real")
def stream_depth_mjpeg():
    if astra_service is None or not astra_service.depth_available:
        return Response(content="Profundidad no disponible", status_code=503)

    def generate():
        while True:
            try:
                frame = astra_service.get_depth_frame()
                jpeg = encode_frame_to_jpeg(frame)
                yield (
                    b"--frame\r\n"
                    b"Content-Type: image/jpeg\r\n\r\n" + jpeg + b"\r\n"
                )
                time.sleep(0.033)
            except Exception as e:
                print(f"❌ Error en MJPEG: {e}")
                break

    return StreamingResponse(generate(), media_type="multipart/x-mixed-replace; boundary=frame")

# ❌ Cerrar cámara
@router.get("/close", summary="Cerrar todos los dispositivos")
def close():
    if astra_service is None:
        return Response(content="❌ No hay dispositivos abiertos", status_code=503)

    try:
        frame = astra_service.get_depth_frame()
        jpeg = encode_frame_to_jpeg(frame)
        return Response(content=jpeg, media_type="image/jpeg")
    except Exception as e:
        return Response(content=f"❌ Error: {e}", status_code=500)
