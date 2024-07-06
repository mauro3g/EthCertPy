import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import {
  ICertificate,
  ICourse,
  IReportOption,
  IReportRequest,
  IStudent,
} from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.scss'],
})
export class ReportFormComponent {
  public onClose: Subject<boolean> = new Subject();
  formReport: FormGroup;

  loading: boolean = false;
  students: IStudent[] = [];
  courses: ICourse[] = [];
  certificates: ICertificate[] = [];
  institutions: string[] = [];
  selectedStudent: IStudent | null = null;
  selectedCourse: ICourse | null = null;
  selectedInstitution: string | null = null;
  selectedOption: IReportOption | null = null;

  optionsId = {
    studentsCourse: 1,
    certificateStudent: 2,
    certificateCourse: 3,
    courseInstitution: 4,
  };

  reportOptions: IReportOption[] = [
    {
      id: this.optionsId.studentsCourse,
      title: 'Estudiantes por Curso',
      option: 'student-course',
    },
    {
      id: this.optionsId.certificateStudent,
      title: 'Certificados por Estudiante',
      option: 'certificate-student',
    },
    {
      id: this.optionsId.certificateCourse,
      title: 'Certificados por Curso',
      option: 'certificate-course',
    },
    {
      id: this.optionsId.courseInstitution,
      title: 'Certificados por Curso',
      option: 'course-institution',
    },
  ];

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.students = config.data.students;
    this.courses = config.data.templates;
    this.certificates = config.data.certificates;
    this.formReport = new FormGroup({
      student: new FormControl<IStudent | null>(this.students[0], []),
      course: new FormControl<ICourse | null>(this.courses[0], []),
      institution: new FormControl<string | null>(this.institutions[0], []),
      option: new FormControl<IReportOption | null>(this.reportOptions[0], []),
    });
    this.selectedStudent = this.students[0];
    this.selectedCourse = this.courses[0];
    this.selectedInstitution = this.institutions[0];
    this.selectedOption = this.reportOptions[0];
    this.extractInstitutions();
  }

  extractInstitutions() {
    this.certificates.forEach((cert) => {
      if (!this.institutions.includes(cert.course.institution)) {
        this.institutions.push(cert.course.institution);
      }
    });
  }

  submit() {
    const requestData: IReportRequest = {
      type: this.selectedOption?.option as string,
      course: '',
      student: '',
      institution: '',
    };
    switch (this.selectedOption?.id) {
      case this.optionsId.studentsCourse:
        requestData.course = this.selectedCourse?.title as string;
        break;
      case this.optionsId.certificateStudent:
        requestData.student = this.selectedStudent?.dni as string;
        break;
      case this.optionsId.certificateCourse:
        requestData.course = this.selectedCourse?.title as string;
        break;
      case this.optionsId.courseInstitution:
        requestData.institution = this.selectedInstitution as string;
        break;
    }
    this.config.data.requestReport(requestData);
  }
}
