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
  country?:string
  phone?:string
  direction?:string
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
  issuedDate: number | string;
  expireDate: number | string;
  link: string;
  hash: string;
  student: IStudent;
  course: ICourse;
}

export interface ISearch {
  searchData: string;
}

export interface IReportRequest {
  type: string;
  course: string;
  student: string;
  institution: string;
}

export interface IReportOption {
  id: number;
  title: string;
  option: string;
}
