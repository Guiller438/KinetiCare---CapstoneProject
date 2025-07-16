from pydantic import BaseModel, EmailStr

class TratamientoRequest(BaseModel):
    paciente_id: str
    edad: int
    sexo: str
    diagnostico: str
    movilidad_articular: str
    nivel_dolor: str
    actividad_diaria: str
    sentimiento_reportado: str
    ejercicios_previos: str
    correo_paciente: EmailStr
