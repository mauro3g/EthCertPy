from fastapi import FastAPI, HTTPException, Depends, status
from typing import Annotated
from models.models import Users, Student, Course, Login, InputCourse, InputCourse2, InputStudent, InputStudent2, InputCertificate 
from database.database import engine, SessionLocal
from sqlalchemy.orm import Session
from web3Con import getCertificateContract, caller
from typing import List

app = FastAPI()
certificate_contract = getCertificateContract()

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

@app.post("/login/", status_code=status.HTTP_200_OK)
async def login(input_value:Login, db:db_dependency):
    result = db.query(Users).filter(
        Users.user==input_value.user & Users.password==input_value.password
    ).first()
    if result is None:
        HTTPException(status_code=404, detail="Usuario o contraseña incorrectos")
    return result

@app.post("/student/", status_code=status.HTTP_201_CREATED)
async def create_students(input_value: List[InputStudent], db: db_dependency):
    student_list = [Student(**value.model_dump()) for value in input_value]
    db.add_all(student_list)
    db.commit()
    return "Los registros se realizaron exitosamente"

@app.get("/student-list/", status_code=status.HTTP_200_OK)
async def get_students(db:db_dependency):
    result = db.query(Student).all()
    return result

@app.post("/course/", status_code=status.HTTP_201_CREATED)
async def create_course(input_value: InputCourse, db: db_dependency):
    new_course = Course(**input_value.model_dump())
    db.add(new_course)
    db.commit()
    return "El curso se registro exitosamente"

@app.get("/course-list/", status_code=status.HTTP_200_OK)
async def get_courses(db:db_dependency):
    result = db.query(Course).all()
    return result

@app.post("/certificate/", status_code=status.HTTP_201_CREATED)
async def create_certificate(input_value: InputCertificate):
    student = InputStudent2(input_value.student)
    course = InputCourse()
    certificate_contract.functions.addCertificate(
        input_value.issuedDate,
        input_value.expireDate,
        input_value.link,
        input_value.hash,
        [student.idstudent,student.name,student.surname,student.dni],
        [course.title,course.description,course.institution,course.duration,course.date]
    ).transact({"from": caller})
    return "El certificado se registro exitosamente"

@app.get("/certificate-list/", status_code=status.HTTP_200_OK)
async def get_certificates():
    certlist = certificate_contract.functions.getAllCertificates().call()
    return certlist

@app.get("/certificate/", status_code=status.HTTP_200_OK)
async def get_certificate(input_value: int):
    certificate = certificate_contract.functions.getCertificateById(input_value).call()
    return certificate

# @app.post("/registro/", status_code=status.HTTP_201_CREATED)
# async def crear_registro(registro:IngresoBase, db:db_dependency):
#     db_registro = Ingreso(**registro.model_dump()) #convierte en un diccionario
#     db.add(db_registro)
#     db.commit()
#     return "El registro se realizo exitosamente"

# @app.get("/listarregistros/", status_code=status.HTTP_200_OK)
# async def consultar_registros(db:db_dependency):
#     registros = db.query(Ingreso).all()
#     return registros

# @app.get("/consultaregistro/{documento_ingreso}", status_code=status.HTTP_200_OK)
# async def consultar_registros_por_documento(documento_ingreso, db:db_dependency):
#     registro = db.query(Ingreso).filter(Ingreso.documentoingreso==documento_ingreso).first()
#     if registro is None:
#         HTTPException(status_code=404, detail="Registro no encontrado")
#     return registro

# @app.delete("/borrarregisro/{id_registro}", status_code=status.HTTP_200_OK)
# async def borrar_registro(id_registro, db:db_dependency):
#     registroborrar = db.query(Ingreso).filter(Ingreso.idregistro==id_registro).first()
#     if registroborrar is None:
#         HTTPException(status_code=404, detail="No se puede borrar no exite el registro")
#     db.delete(registroborrar)
#     db.commit()
#     return "EL registro de elimino exitosamente"

# @app.post("/actualizarregistro/", status_code=status.HTTP_200_OK)
# async def actualizar_registro (registro:IngresoBase2, db:db_dependency):
#      registroactualizar = db.query(Ingreso).filter(Ingreso.idregistro==registro.idregistro).first()
#      if registroactualizar is None:
#          HTTPException(status_code=404, detail="No se encuentra el registro")
#      registroactualizar.documentoingreso = registro.documentoingreso
#      registroactualizar.nombrepersona = registro.nombrepersona
#      db.commit()
#      return "Registro actualizado exitosamente"