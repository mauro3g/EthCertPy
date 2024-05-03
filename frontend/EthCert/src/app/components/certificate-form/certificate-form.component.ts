import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { ICertificate, ICourse, IStudent } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-certificate-form',
  templateUrl: './certificate-form.component.html',
  styleUrls: ['./certificate-form.component.scss'],
})
export class CertificateFormComponent {
  public onClose: Subject<boolean> = new Subject();
  formCertificate: FormGroup;

  loading: boolean = false;
  students: IStudent[] = [];
  courses: ICourse[] = [];
  selectedStudent: IStudent | null = null;
  selectedCourse: ICourse | null = null;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.students = config.data.students;
    this.courses = config.data.templates;
    this.formCertificate = new FormGroup({
      student: new FormControl<IStudent | null>(this.students[0], [
        Validators.required,
      ]),
      course: new FormControl<ICourse | null>(this.courses[0], [
        Validators.required,
      ]),
      expireDate: new FormControl('', []),
    });
    this.selectedStudent = this.students[0];
    this.selectedCourse = this.courses[0];
  }

  doCreate(body: ICertificate) {
    console.log(body);
    this.config.data.registerData(body);
  }

  submit() {
    let issuedDate: number = new Date().getTime();
    let expireDate = 0;
    if (this.formCertificate.value.expireDate) {
      expireDate = new Date(this.formCertificate.value.expireDate).getTime();
    }
    this.doCreate({
      ...this.formCertificate.value,
      issuedDate: issuedDate,
      expireDate: expireDate,
    });
  }
}
