from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DespachoBase(BaseModel):
    tracking_code: str
    cliente_nombre: str
    direccion_entrega: str
    latitud: Optional[float] = None
    longitud: Optional[float] = None
    repartidor_nombre: Optional[str] = None
    notas: Optional[str] = None

class DespachoCreate(DespachoBase):
    pass

class DespachoResponse(DespachoBase):
    id: int
    estado: str
    tiempo_creacion: datetime
    tiempo_inicio: Optional[datetime] = None
    tiempo_entrega: Optional[datetime] = None

    class Config:
        from_attributes = True

class CambioEstado(BaseModel):
    estado: str
    latitud: Optional[float] = None
    longitud: Optional[float] = None