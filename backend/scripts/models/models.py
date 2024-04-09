from sqlalchemy import String, Integer, Column

from database.database import Base

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
    duration = Column(String(32))
    date = Column(String(32))