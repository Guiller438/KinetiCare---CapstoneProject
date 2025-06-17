from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class CapturaModel(BaseModel):
    timestamp: datetime
    rgb_base64: str
    depth_map: List[List[int]]
    perfil_vertical_mm: List[int]
    media_distancia_mm: float
    silueta_binaria: Optional[List[List[int]]] = None

class SesionEvaluacionModel(BaseModel):
    evaluacion_id: int
    usuario_id: int
    anotaciones: Optional[str] = ""
    capturas: List[CapturaModel]
