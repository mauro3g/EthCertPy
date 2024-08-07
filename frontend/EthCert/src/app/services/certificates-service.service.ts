import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Type } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ICertificate,
  ICourse,
  ILogin,
  IReportRequest,
  IStudent,
} from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class CertificatesServiceService {
  //private readonly API_URL = 'http://localhost:8000/';
  private readonly API_URL = 'http://192.168.56.101:8000/';
  //private readonly API_URL = 'https://d8cfe026-bdbe-4cff-9d2b-e0402a169485.mock.pstmn.io/';

  constructor(private readonly httpClient: HttpClient) {}

  login(body: ILogin): Observable<ILogin> {
    return this.httpClient.post<ILogin>(this.API_URL + 'login', body);
  }

  create_student(body: IStudent[]): Observable<string> {
    return this.httpClient.post<string>(this.API_URL + 'student', body);
  }

  modify_student(inputStudent: IStudent): Observable<string> {
    return this.httpClient.put<string>(this.API_URL + 'student/'+ inputStudent.idstudent, inputStudent);
  }

  delete_student(inputStudent: IStudent): Observable<string> {
    return this.httpClient.delete<string>(this.API_URL + 'student/'+ inputStudent.idstudent);
  }

  upload_students(file: File): Observable<string> {
    console.log("upload ser")
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.httpClient.post<string>(this.API_URL + 'student-upload', formData);
  }

  get_students(): Observable<IStudent[]> {
    return this.httpClient.get<IStudent[]>(this.API_URL + 'student-list');
  }

  create_course(body: ICourse): Observable<string> {
    return this.httpClient.post<string>(this.API_URL + 'course', body);
  }

  modify_course(inputCourse: ICourse): Observable<string> {
    return this.httpClient.put<string>(this.API_URL + 'course/'+ inputCourse.idcourse, inputCourse);
  }

  delete_course(inputCourse: ICourse): Observable<string> {
    return this.httpClient.delete<string>(this.API_URL + 'course/'+ inputCourse.idcourse);
  }

  get_courses(): Observable<ICourse[]> {
    return this.httpClient.get<ICourse[]>(this.API_URL + 'course-list');
  }

  create_certificate(body: ICertificate): Observable<string> {
    body.idcertificate = 0;
    body.link = '';
    body.hash = '';
    return this.httpClient.post<string>(this.API_URL + 'certificate', body);
  }

  get_certificates(): Observable<ICertificate[]> {
    return this.httpClient.get<ICertificate[]>(
      this.API_URL + 'certificate-list'
    );
  }

  get_certificate(id: string): Observable<ICertificate[]> {
    return this.httpClient.get<ICertificate[]>(
      this.API_URL + 'certificate' + `/${id}`
    );
  }

  download_report(request: IReportRequest): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.httpClient.post(this.API_URL + 'certificate-report', request, {
      headers,
      responseType: 'blob',
    });
  }
}
