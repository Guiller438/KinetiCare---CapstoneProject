import os
import cv2
import numpy as np
from datetime import datetime
from primesense import openni2

class AstraCameraService:
    def __init__(self, openni_path=r"C:\Orbecc\OpenNI_2.3.0.86_202210111950_4c8f5aa4_beta6_windows\OpenNI_2.3.0.86_202210111950_4c8f5aa4_beta6_windows\samples\bin"):
        print("🔄 Inicializando OpenNI2...")
        openni2.initialize(openni_path)

        if not openni2.is_initialized():
            raise RuntimeError("❌ No se pudo inicializar OpenNI2.")

        print("✅ OpenNI2 inicializado correctamente.")

        try:
            self.device = openni2.Device.open_any()
            print("✅ Dispositivo Astra detectado.")
        except Exception as e:
            raise RuntimeError(f"❌ No se detectó dispositivo Astra. {e}")

        # Flujo RGB con OpenNI2
        try:
            color_stream = self.device.create_color_stream()
            if color_stream is not None:
                self.color_stream = color_stream
                self.color_stream.start()
                self.rgb_available = True
                self.using_cv2_camera = False
                print("✅ Flujo RGB iniciado desde OpenNI2.")
            else:
                raise ValueError("❌ Stream RGB OpenNI2 es None.")
        except Exception as e:
            print(f"⚠️ OpenNI2 RGB falló. Intentando usar cámara OpenCV...")
            self.cv2_rgb_camera = None
            for i in range(2):  # Probar primeros 2 índices
                cam = cv2.VideoCapture(i)
                if cam.isOpened():
                    self.cv2_rgb_camera = cam
                    self.rgb_available = True
                    self.using_cv2_camera = True
                    print(f"✅ Cámara RGB abierta con OpenCV en índice {i}.")
                    break
            if self.cv2_rgb_camera is None:
                self.rgb_available = False
                self.using_cv2_camera = False
                print("❌ No se pudo abrir ninguna cámara RGB con OpenCV.")

        # Flujo de profundidad
        try:
            self.depth_stream = self.device.create_depth_stream()
            self.depth_stream.start()
            self.depth_available = True
            print("✅ Flujo de profundidad iniciado.")
        except Exception as e:
            self.depth_available = False
            print(f"⚠️ Flujo de profundidad no disponible: {e}")

    def get_rgb_frame(self):
        if not self.rgb_available:
            raise RuntimeError("❌ RGB no disponible.")

        try:
            if self.using_cv2_camera:
                ret, frame = self.cv2_rgb_camera.read()
                if not ret:
                    raise RuntimeError("❌ Fallo al capturar frame con OpenCV.")
                return frame  # BGR directo
            else:
                frame = self.color_stream.read_frame()
                data = frame.get_buffer_as_uint8()
                image = np.ndarray((frame.height, frame.width, 3), dtype=np.uint8, buffer=data)
                return cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
        except Exception as e:
            raise RuntimeError(f"❌ Error capturando RGB: {e}")

    def get_depth_frame(self):
        if not self.depth_available:
            raise RuntimeError("❌ Flujo de profundidad no disponible.")
        try:
            frame = self.depth_stream.read_frame()
            data = frame.get_buffer_as_uint16()
            image = np.ndarray((frame.height, frame.width), dtype=np.uint16, buffer=data)
            norm = cv2.convertScaleAbs(image, alpha=0.03)
            return cv2.applyColorMap(norm, cv2.COLORMAP_JET)
        except Exception as e:
            raise RuntimeError(f"❌ Error capturando profundidad: {e}")

    def capture_and_save(self, output_dir="capturas", modo="rgb"):
        os.makedirs(output_dir, exist_ok=True)
        frame = self.get_rgb_frame() if modo == "rgb" else self.get_depth_frame()
        tipo = "rgb" if modo == "rgb" else "depth"
        filename = f"{output_dir}/{tipo}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
        cv2.imwrite(filename, frame)
        print(f"📸 Imagen guardada en: {filename}")
        return filename

# Instancia global
try:
    astra_service = AstraCameraService()
except RuntimeError as e:
    print(str(e))
    astra_service = None
