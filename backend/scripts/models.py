from sqlalchemy import String, Integer, Column

from backend.scripts.database import Base
from pydantic import BaseModel

#DB Models

class Users(Base):
    __tablename__="users"
    iduser = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    user = Column(String(10))
    password = Column(String(25))

class Student(Base):
    __tablename__="student"
    idstudent = Column(Integer, primary_key=True, index=True)
    name = Column(String(32))
    surname = Column(String(32))
    dni = Column(String(13))
    
class Course(Base):
    __tablename__="course"
    idcourse = Column(Integer, primary_key=True, index=True)
    title = Column(String(32))
    description = Column(String(50))
    institution = Column(String(32))
    duration = Column(String(32))
    date = Column(String(32))
    
#POJO

class Login(BaseModel):
    user:str
    password: str
    
class InputUser(BaseModel):
    user:str
    password: str

class InputStudent(BaseModel):
    name:str
    surname: str
    dni:str

class InputStudent2(BaseModel):
    idstudent:int
    name:str
    surname: str
    dni:str

class InputCourse(BaseModel):
    title:str
    description:str
    institution:str
    duration:str
    date:str

class InputCourse2(BaseModel):
    idcourse:int
    title:str
    description:str
    institution:str
    duration:str
    date:str


class InputCertificate(BaseModel):
    idcertificate:int
    issuedDate: int
    expireDate: int
    link: str
    hash: str
    student:InputStudent2
    course: InputCourse
    
class InputReportRequest(BaseModel):
    type: str
    course: str
    student: str
    institution: str
