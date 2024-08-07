import csv
import io
from datetime import datetime, timezone
from fastapi import FastAPI, HTTPException, Depends, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from typing import Annotated
from backend.scripts.database import SessionLocal
from backend.scripts.models import InputReportRequest, Users, Student, Course, Login, InputCourse, InputStudent, InputCertificate 
from backend.scripts.web3Con import getCertificateContract, caller
from sqlalchemy.orm import Session
from typing import List
from hashlib import sha1

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

certificate_contract = getCertificateContract()

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

def generate_student_course_report(writer, certificates, input_value):
    writer.writerow(["curso", input_value.course])
    writer.writerow(["dni","nombre", "apellido", "curso", "duracion", "institucion", "hash", "id","emitido", "expira"])
    
    for cert in certificates:
        if cert["course"]["title"] == input_value.course:
            date_issued = datetime.fromtimestamp(cert["issuedDate"]/1000.0)
            date_expired = datetime.fromtimestamp(cert["expireDate"]/1000.0)
            writer.writerow([
                cert["student"]["dni"],
                cert["student"]["name"],
                cert["student"]["surname"],
                cert["course"]["title"],
                cert["course"]["duration"],
                cert["course"]["institution"],
                cert["hash"],
                cert["idcertificate"],
                date_issued.strftime("%Y-%m-%d %H:%M:%S"),
                date_expired.strftime("%Y-%m-%d %H:%M:%S")
            ])

def generate_certificate_student_report(writer, certificates, input_value):
    writer.writerow(["estudiante", input_value.student])
    writer.writerow(["dni", "nombre", "apellido" , "curso", "duracion", "institucion", "hash", "id","emitido", "expira"])
    for cert in certificates:
        if cert["student"]["dni"] == input_value.student:
            date_issued = datetime.fromtimestamp(cert["issuedDate"]/1000.0)
            date_expired = datetime.fromtimestamp(cert["expireDate"]/1000.0)
            writer.writerow([
                cert["student"]["dni"],
                cert["student"]["name"],
                cert["student"]["surname"],
                cert["course"]["title"],
                cert["course"]["duration"],
                cert["course"]["institution"],
                cert["hash"],
                cert["idcertificate"],
                date_issued.strftime("%Y-%m-%d %H:%M:%S"),
                date_expired.strftime("%Y-%m-%d %H:%M:%S")
            ])

def generate_certificate_course_report(writer, certificates, input_value):
    writer.writerow(["curso", input_value.course])
    writer.writerow(["dni", "nombre", "apellido", "curso", "duracion", "institucion", "hash", "id", "emitido", "expira" ])
    for cert in certificates:
        if cert["course"]["title"] == input_value.course:
            date_issued = datetime.fromtimestamp(cert["issuedDate"]/1000.0)
            date_expired = datetime.fromtimestamp(cert["expireDate"]/1000.0)
            writer.writerow([
                cert["student"]["dni"],
                cert["student"]["name"],
                cert["student"]["surname"],
                cert["course"]["title"],
                cert["course"]["duration"],
                cert["course"]["institution"],
                cert["hash"],
                cert["idcertificate"],
                date_issued.strftime("%Y-%m-%d %H:%M:%S"),
                date_expired.strftime("%Y-%m-%d %H:%M:%S")
            ])

def generate_course_institution_report(writer, certificates, input_value):
    writer.writerow(["institucion", input_value.institution])
    writer.writerow(["curso", "institucion", "duracion", "descripcion", "fecha"])
    for cert in certificates:
        if cert["course"]["institution"] == input_value.institution:
            writer.writerow([
                cert["course"]["title"],
                cert["course"]["institution"],
                cert["course"]["duration"],
                cert["course"]["description"],
                cert["course"]["date"]
            ])
            
def transform_certificate_to_json(array):
    json_array = []
    for item in array:
        id_certificate = item[0]
        issued_date = item[1]
        expire_date = item[2]
        link = item[3]
        hash_var = item[4]
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
            "issuedDate": issued_date,
            "expireDate": expire_date,
            "link": link,
            "hash": hash_var,
            "student": json_student,
            "course": json_course
        }
        
        json_array.append(json_object)
    
    return json_array

def extract_all_certificates():
    return transform_certificate_to_json(certificate_contract.functions.getAllCertificates().call())

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

@app.put("/student/{student_id}", status_code=status.HTTP_200_OK)
async def update_student(student_id: int, input_value: InputStudent, db: db_dependency):
    student = db.query(Student).filter(Student.idstudent == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    for key, value in input_value.dict().items():
        setattr(student, key, value)
    
    db.commit()
    return {"message": "Student record updated successfully"}

@app.delete("/student/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_student(student_id: int, db: db_dependency):
    student = db.query(Student).filter(Student.idstudent == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    db.delete(student)
    db.commit()
    return {"message": "Student record deleted successfully"}

@app.get("/student-list/", status_code=status.HTTP_200_OK)
async def get_students(db: db_dependency):
    result = db.query(Student).all()
    return result

@app.post("/student-upload/", status_code=status.HTTP_201_CREATED)
async def upload_csv_students(file: UploadFile, db: db_dependency):
    contents = await file.read()
    # Use StringIO to convert bytes to a file-like object
    decoded_contents = contents.decode('utf-8')
    csv_reader = csv.reader(io.StringIO(decoded_contents))

    # Extract information into an object
    data: List[InputStudent] = []
    for row in csv_reader:
        # Assuming the CSV has columns: column1, column2, column3
        if row[0] != 'nombre' and row[0] != 'name':
            data.append(InputStudent(name=row[0], surname=row[1], dni=row[2], country=row[3], phone=row[4], direction=row[5]))
    student_list = [Student(name=value.name, surname=value.surname, dni=value.dni, country=value.country, phone=value.phone, direction=value.direction) for value in data]
    #search for registered dni
    dni_values = [student.dni for student in student_list]
    # Search for coincidences of the dni values in the database
    result = db.query(Student).filter(Student.dni.in_(dni_values)).all()
    # Extract the dni values from the result
    result_dni_values = {student.dni for student in result}
    # Filter the student_list to exclude students whose dni is in result_dni_values
    filtered_student_list = [student for student in student_list if student.dni not in result_dni_values]
    
    db.add_all(filtered_student_list)
    db.commit() 
    
    return "Los registros se realizaron exitosamente"

@app.post("/course/", status_code=status.HTTP_201_CREATED)
async def create_course(input_value: InputCourse, db: db_dependency):
    new_course = Course(**input_value.model_dump())
    db.add(new_course)
    db.commit()
    return "El curso se registro exitosamente"

@app.put("/course/{course_id}", status_code=status.HTTP_200_OK)
async def update_course(course_id: int, input_value: InputCourse, db: db_dependency):
    course = db.query(Course).filter(Course.idcourse == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    
    for key, value in input_value.dict().items():
        setattr(course, key, value)
    
    db.commit()
    return {"message": "Course record updated successfully"}

@app.delete("/course/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_course(course_id: int, db: db_dependency):
    course = db.query(Course).filter(Course.idcourse == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="course not found")
    
    db.delete(course)
    db.commit()
    return {"message": "course record deleted successfully"}

@app.get("/course-list/", status_code=status.HTTP_200_OK)
async def get_courses(db:db_dependency):
    result = db.query(Course).all()
    return result

@app.post("/certificate/", status_code=status.HTTP_201_CREATED)
async def create_certificate(input_value: InputCertificate):
    student = input_value.student
    course = input_value.course
    hash_certificate = sha1((str(student.idstudent)+student.dni+str(input_value.issuedDate)+course.title).encode("UTF-8")).hexdigest()
    certificate_contract.functions.addCertificate(
        input_value.issuedDate,
        input_value.expireDate,
        input_value.link,
        hash_certificate,
        [student.idstudent,student.name,student.surname,student.dni],
        [course.title,course.description,course.institution,course.duration,course.date]
    ).transact({"from": caller})
    return "El certificado se registro exitosamente"

@app.get("/certificate-list/", status_code=status.HTTP_200_OK)
async def get_certificates():
    return extract_all_certificates()

@app.post("/certificate-report/", status_code=status.HTTP_200_OK)
async def get_report(input_value: InputReportRequest):
    output = io.StringIO()
    writer = csv.writer(output)
    certificates = extract_all_certificates()
    
    report_generators = {
        'student-course': generate_student_course_report,
        'certificate-student': generate_certificate_student_report,
        'certificate-course': generate_certificate_course_report,
        'course-institution': generate_course_institution_report
    }

    report_generator = report_generators.get(input_value.type)
    if report_generator:
        report_generator(writer, certificates, input_value)
    else:
        raise ValueError(f"Invalid report type: {input_value.type}")

    output.seek(0)
    return StreamingResponse(output, media_type="text/csv", headers={"Content-Disposition": "attachment; filename=export.csv"})

@app.get("/certificate/{input_value}", status_code=status.HTTP_200_OK)
async def get_certificate(input_value: str):
    certificate = transform_certificate_to_json([certificate_contract.functions.getCertificateById(input_value).call()])
    return certificate