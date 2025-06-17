import os
import cv2
import numpy as np
import base64
from datetime import datetime
from primesense import openni2
import win32com.client

def release_all_cameras(max_index=5):
    print("🔧 Cerrando posibles cámaras abiertas antes de iniciar...")
    for i in range(max_index):
        cap = cv2.VideoCapture(i)
        if cap.isOpened():
            cap.release()
            print(f"🔒 Cámara en índice {i} liberada.")
    cv2.destroyAllWindows()

def find_astra_camera_index():
    print("🔍 Buscando cámaras disponibles con WMI...")
    system_devices = win32com.client.Dispatch("WbemScripting.SWbemLocator")
    services = system_devices.ConnectServer(".", "root\\cimv2")
    devices = services.ExecQuery("SELECT * FROM Win32_PnPEntity WHERE Name LIKE '%camera%'")

    for i in range(5):  # Intentar abrir hasta 5 cámaras
        cap = cv2.VideoCapture(i)
        if cap.isOpened():
            for device in devices:
                if "astra" in device.Name.lower():
                    print(f"🎯 Cámara Astra detectada: '{device.Name}' en índice {i}")
                    cap.release()
                    return i
            cap.release()
    print("❌ No se encontró cámara Astra por nombre con WMI.")
    return None

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

        # Flujo RGB
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
            print("⚠️ OpenNI2 RGB falló. Intentando usar cámara OpenCV...")
            self.cv2_rgb_camera = None
            astra_index = find_astra_camera_index()
            if astra_index is not None:
                temp_cam = cv2.VideoCapture(astra_index)
                ret, _ = temp_cam.read()
                if ret:
                    self.cv2_rgb_camera = temp_cam
                    self.rgb_available = True
                    self.using_cv2_camera = True
                    print(f"✅ Cámara Astra abierta con OpenCV en índice {astra_index}.")
                else:
                    temp_cam.release()
                    self.rgb_available = False
                    self.using_cv2_camera = False
                    print("❌ Cámara Astra detectada pero no devuelve imagen.")
            else:
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
                return frame
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

    def tomar_captura(self):
        if not self.depth_available:
            raise RuntimeError("❌ Profundidad no disponible.")

        # Captura profundidad en mm (sin normalizar)
        frame = self.depth_stream.read_frame()
        depth_data = frame.get_buffer_as_uint16()
        depth_array = np.ndarray((frame.height, frame.width), dtype=np.uint16, buffer=depth_data)

        perfil_vertical = depth_array[:, depth_array.shape[1] // 2].tolist()
        media_mm = float(np.mean(depth_array))
        silueta = (depth_array < 2000).astype(int).tolist()

        return {
            "timestamp": datetime.now(),
            "perfil_vertical_mm": perfil_vertical,
            "media_distancia_mm": media_mm,
            "silueta_binaria": silueta
            # Omitimos rgb_base64 y depth_map para evitar carga pesada
        }


    def capture_and_save(self, output_dir="capturas", modo="rgb"):
        os.makedirs(output_dir, exist_ok=True)
        frame = self.get_rgb_frame() if modo == "rgb" else self.get_depth_frame()
        tipo = "rgb" if modo == "rgb" else "depth"
        filename = f"{output_dir}/{tipo}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
        cv2.imwrite(filename, frame)
        print(f"📸 Imagen guardada en: {filename}")
        return filename

    def close(self):
        if hasattr(self, "color_stream") and self.color_stream is not None:
            try:
                self.color_stream.stop()
            except Exception:
                pass
        if hasattr(self, "depth_stream") and self.depth_stream is not None:
            try:
                self.depth_stream.stop()
            except Exception:
                pass
        if hasattr(self, "cv2_rgb_camera") and self.cv2_rgb_camera is not None:
            try:
                self.cv2_rgb_camera.release()
            except Exception:
                pass
        try:
            openni2.unload()
        except Exception:
            pass
        print("🔒 Recursos de AstraCameraService liberados.")

# 🧼 Limpieza inicial de cámaras abiertas por procesos anteriores
release_all_cameras()

# ✅ Instancia global reutilizable en todo el microservicio
try:
    astra_service = AstraCameraService()
except RuntimeError as e:
    print(str(e))
    astra_service = None
