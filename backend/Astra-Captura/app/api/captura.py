from fastapi import APIRouter, Response
from app.services.astra_camera import astra_service
from app.utils.image_encoder import encode_frame_to_jpeg
from fastapi.responses import StreamingResponse
import time



router = APIRouter(prefix="/astra", tags=["Captura Astra"])

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
                time.sleep(0.033)  # ~30 FPS
            except Exception as e:
                print(f"❌ Error en MJPEG: {e}")
                break
    return StreamingResponse(generate(), media_type="multipart/x-mixed-replace; boundary=frame")


    try:
        frame = astra_service.get_depth_frame()
        jpeg = encode_frame_to_jpeg(frame)
        return Response(content=jpeg, media_type="image/jpeg")
    except Exception as e:
        return Response(content=f"❌ Error: {e}", status_code=500)
