export interface IUser {
  iduser?: number;
  name: string;
  user: string;
  password: string;
}

export interface IStudent {
  idstudent?: number;
  name: string;
  surname: string;
  dni: string;
}

export interface ICourse {
  idcourse?: number;
  title: string;
  description: string;
  institution: string;
  duration: string;
  date: string | Date;
}

export interface ILogin {
  user: string;
  password: string;
}

export interface ICertificate {
  idcertificate?: number;
  issuedDate: number;
  expireDate: number;
  link: string;
  hash: string;
  student: IStudent;
  course: ICourse;
}

