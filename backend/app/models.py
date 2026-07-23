from sqlalchemy import Column, Integer, String, Text, DateTime, Numeric, Boolean, ForeignKey
from sqlalchemy.sql import func
from app.database import Base

class Despacho(Base):
    __tablename__ = "despachos"

    id = Column(Integer, primary_key=True, index=True)
    tracking_code = Column(String(50), unique=True, nullable=False)
    cliente_nombre = Column(String(255), nullable=False)
    direccion_entrega = Column(Text, nullable=False)
    latitud = Column(Numeric(10, 8))
    longitud = Column(Numeric(11, 8))
    estado = Column(String(50), nullable=False, default="pendiente")
    repartidor_nombre = Column(String(255))
    tiempo_creacion = Column(DateTime(timezone=True), server_default=func.now())
    tiempo_inicio = Column(DateTime(timezone=True))
    tiempo_entrega = Column(DateTime(timezone=True))
    notas = Column(Text)

class EstadoHistorial(Base):
    __tablename__ = "estado_historial"

    id = Column(Integer, primary_key=True, index=True)
    despacho_id = Column(Integer, ForeignKey("despachos.id"))
    estado_anterior = Column(String(50))
    estado_nuevo = Column(String(50), nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    latitud = Column(Numeric(10, 8))
    longitud = Column(Numeric(11, 8))