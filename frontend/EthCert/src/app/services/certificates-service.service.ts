import { HttpClient } from '@angular/common/http';
import { Injectable, Type } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ICertificate,
  ICourse,
  ILogin,
  IStudent,
} from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class CertificatesServiceService {
  private readonly API_URL = 'http://localhost:8000/';
  //private readonly API_URL = 'https://d8cfe026-bdbe-4cff-9d2b-e0402a169485.mock.pstmn.io/';

  constructor(private readonly httpClient: HttpClient) {}

  login(body: ILogin): Observable<ILogin> {
    return this.httpClient.post<ILogin>(this.API_URL + 'login', body);
  }

  create_student(body: IStudent[]): Observable<string> {
    return this.httpClient.post<string>(this.API_URL + 'student', body);
  }

  get_students(): Observable<IStudent[]> {
    return this.httpClient.get<IStudent[]>(this.API_URL + 'student-list');
  }

  create_course(body: ICourse): Observable<string> {
    return this.httpClient.post<string>(this.API_URL + 'course', body);
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
}
