from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import despachos

app = FastAPI(title="Dashboard Despachos API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

app.include_router(despachos.router, prefix="/api/despachos", tags=["despachos"])

@app.get("/")
async def root():
    return {"message": "API de Despachos funcionando"}