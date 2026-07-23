from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models import Despacho, EstadoHistorial
from app.schemas import DespachoCreate, DespachoResponse, CambioEstado
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=DespachoResponse)
async def crear_despacho(despacho: DespachoCreate, db: AsyncSession = Depends(get_db)):
    nuevo = Despacho(**despacho.model_dump())
    db.add(nuevo)
    await db.commit()
    await db.refresh(nuevo)
    return nuevo

@router.get("/", response_model=list[DespachoResponse])
async def listar_despachos(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Despacho).order_by(Despacho.tiempo_creacion.desc()))
    return result.scalars().all()

@router.get("/{despacho_id}", response_model=DespachoResponse)
async def obtener_despacho(despacho_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Despacho).where(Despacho.id == despacho_id))
    despacho = result.scalar_one_or_none()
    if not despacho:
        raise HTTPException(status_code=404, detail="Despacho no encontrado")
    return despacho

@router.patch("/{despacho_id}/estado", response_model=DespachoResponse)
async def cambiar_estado(despacho_id: int, cambio: CambioEstado, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Despacho).where(Despacho.id == despacho_id))
    despacho = result.scalar_one_or_none()
    if not despacho:
        raise HTTPException(status_code=404, detail="Despacho no encontrado")
    
    estado_anterior = despacho.estado
    despacho.estado = cambio.estado
    
    if cambio.estado == "en_camino" and not despacho.tiempo_inicio:
        despacho.tiempo_inicio = datetime.utcnow()
    elif cambio.estado == "entregado":
        despacho.tiempo_entrega = datetime.utcnow()
    
    historial = EstadoHistorial(
        despacho_id=despacho_id,
        estado_anterior=estado_anterior,
        estado_nuevo=cambio.estado,
        latitud=cambio.latitud,
        longitud=cambio.longitud
    )
    db.add(historial)
    await db.commit()
    await db.refresh(despacho)
    return despacho