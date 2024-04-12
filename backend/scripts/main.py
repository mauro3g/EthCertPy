from fastapi import FastAPI, HTTPException, Depends, status
from typing import Annotated
from backend.scripts.database import SessionLocal
from backend.scripts.models import Users, Student, Course, Login, InputCourse, InputStudent, InputStudent2, InputCertificate 
from backend.scripts.web3Con import getCertificateContract, caller
from sqlalchemy.orm import Session
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
        Users.user==input_value.user, Users.password==input_value.password
    ).first()
    HTTPException(status_code=404, detail="Usuario o contraseña incorrectos")
    if result is None:
        return HTTPException(status_code=404, detail="Usuario o contraseña incorrectos")
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
    student = input_value.student
    course = input_value.course
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

@app.get("/certificate/{input_value}", status_code=status.HTTP_200_OK)
async def get_certificate(input_value: int):
    certificate = certificate_contract.functions.getCertificateById(input_value).call()
    return certificate