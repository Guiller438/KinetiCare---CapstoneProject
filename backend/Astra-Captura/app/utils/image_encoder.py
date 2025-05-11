import cv2

def encode_frame_to_jpeg(frame):
    ret, buffer = cv2.imencode('.jpg', frame)
    if not ret:
        raise ValueError("No se pudo codificar la imagen.")
    return buffer.tobytes()
