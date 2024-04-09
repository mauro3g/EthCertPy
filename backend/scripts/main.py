from fastapi import FastAPI, HTTPException, Depends, status

from pydantic import BaseModel
from typing import Annotated
from models.models import Ingreso
from database.database import engine, SessionLocal
from sqlalchemy.orm import Session
from web3Con import getCertificateContract

app = FastAPI()
certificateContract = getCertificateContract()

class IngresoBase(BaseModel):
    dni:str
    name:str

class IngresoBase2(BaseModel):
    iduser:int
    dni:str
    name:str

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

@app.post("/registro/", status_code=status.HTTP_201_CREATED)
async def crear_registro(registro:IngresoBase, db:db_dependency):
    db_registro = Ingreso(**registro.model_dump()) #convierte en un diccionario
    db.add(db_registro)
    db.commit()
    return "El registro se realizo exitosamente"

@app.get("/listarregistros/", status_code=status.HTTP_200_OK)
async def consultar_registros(db:db_dependency):
    registros = db.query(Ingreso).all()
    return registros

@app.get("/consultaregistro/{documento_ingreso}", status_code=status.HTTP_200_OK)
async def consultar_registros_por_documento(documento_ingreso, db:db_dependency):
    registro = db.query(Ingreso).filter(Ingreso.documentoingreso==documento_ingreso).first()
    if registro is None:
        HTTPException(status_code=404, detail="Registro no encontrado")
    return registro

@app.delete("/borrarregisro/{id_registro}", status_code=status.HTTP_200_OK)
async def borrar_registro(id_registro, db:db_dependency):
    registroborrar = db.query(Ingreso).filter(Ingreso.idregistro==id_registro).first()
    if registroborrar is None:
        HTTPException(status_code=404, detail="No se puede borrar no exite el registro")
    db.delete(registroborrar)
    db.commit()
    return "EL registro de elimino exitosamente"

@app.post("/actualizarregistro/", status_code=status.HTTP_200_OK)
async def actualizar_registro (registro:IngresoBase2, db:db_dependency):
     registroactualizar = db.query(Ingreso).filter(Ingreso.idregistro==registro.idregistro).first()
     if registroactualizar is None:
         HTTPException(status_code=404, detail="No se encuentra el registro")
     registroactualizar.documentoingreso = registro.documentoingreso
     registroactualizar.nombrepersona = registro.nombrepersona
     db.commit()
     return "Registro actualizado exitosamente"