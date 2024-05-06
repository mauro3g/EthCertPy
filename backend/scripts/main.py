from fastapi import FastAPI, HTTPException, Depends, status
from typing import Annotated
from backend.scripts.database import SessionLocal
from backend.scripts.models import Users, Student, Course, Login, InputCourse, InputStudent, InputStudent2, InputCertificate 
from backend.scripts.web3Con import getCertificateContract, caller
from sqlalchemy.orm import Session
from typing import List
from hashlib import sha1

app = FastAPI()
certificate_contract = getCertificateContract()

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]


def transform_certificate_to_json(array):
    json_array = []
    for item in array:
        id_certificate = item[0]
        issuedDate = item[1]
        expireDate = item[2]
        link = item[3]
        hash = item[4]
        id_student = item[5][0]
        student_name = item[5][1]
        student_surname = item[5][2]
        student_dni = item[5][3]
        course_title = item[6][0]
        course_description = item[6][1]
        course_institution = item[6][2]
        course_duration = item[6][3]
        course_date = item[6][4]
        
        json_course = {
            "title": course_title,
            "description": course_description,
            "institution": course_institution,
            "duration": course_duration,
            "date": course_date 
        }
        
        json_student = {
            "idstudent": id_student,
            "name": student_name,
            "surname": student_surname,
            "dni": student_dni
        }
        
        json_object = {
            "idcertificate": id_certificate,
            "issuedDate": issuedDate,
            "expireDate": expireDate,
            "link": link,
            "hash": hash,
            "student": json_student,
            "course": json_course
        }
        
        json_array.append(json_object)
    
    return json_array


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
    hashCertificate = sha1((str(student.idstudent)+student.dni+str(input_value.issuedDate)+course.title).encode("UTF-8")).hexdigest()
    certificate_contract.functions.addCertificate(
        input_value.issuedDate,
        input_value.expireDate,
        input_value.link,
        hashCertificate,
        [student.idstudent,student.name,student.surname,student.dni],
        [course.title,course.description,course.institution,course.duration,course.date]
    ).transact({"from": caller})
    return "El certificado se registro exitosamente"

@app.get("/certificate-list/", status_code=status.HTTP_200_OK)
async def get_certificates():
    certlist = transform_certificate_to_json(certificate_contract.functions.getAllCertificates().call())
    return certlist

@app.get("/certificate/{input_value}", status_code=status.HTTP_200_OK)
async def get_certificate(input_value: str):
    certificate = transform_certificate_to_json([certificate_contract.functions.getCertificateById(input_value).call()])
    return certificate