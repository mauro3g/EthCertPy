import { Component, OnInit } from '@angular/core';
import { CertificatesServiceService } from '../../services/certificates-service.service';
import {
  ICertificate,
  ICourse,
  IReportRequest,
  IStudent,
} from 'src/app/interfaces/interfaces';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { StudentsFormComponent } from 'src/app/components/students-form/students-form.component';
import { BehaviorSubject } from 'rxjs';
import { CourseFormComponent } from 'src/app/components/course-form/course-form.component';
import { CertificateFormComponent } from 'src/app/components/certificate-form/certificate-form.component';
import { Router } from '@angular/router';
import { StudentsUploadComponent } from '../../components/students-upload/students-upload.component';
import { ReportFormComponent } from 'src/app/components/report-form/report-form.component';
import { CertificateValidateModalComponent } from 'src/app/components/certificate-validate/certificate-validate-modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [DialogService, MessageService, ConfirmationService],
})
export class HomeComponent implements OnInit {
  items: MenuItem[] = [];
  students: IStudent[] = [];
  certificates: ICertificate[] = [];
  courses: ICourse[] = [];
  ref: DynamicDialogRef | undefined;
  showStudents: boolean = false;
  showCertificates: boolean = false;
  showCourses: boolean = false;
  showSuccess: boolean = false;
  showSuccessModify: boolean = false;
  showSuccessDelete: boolean = false;
  showNotAllowed: boolean = false;
  showError: boolean = false;
  loading = new BehaviorSubject<boolean>(false);
  loadingTables = new BehaviorSubject<boolean>(true);
  isExpanding = false;
  hideButtons = false;

  toggleSideBar() {
    this.isExpanding = !this.isExpanding;
  }

  constructor(
    private readonly certificateService: CertificatesServiceService,
    public dialogService: DialogService,
    public messageService: MessageService,
    public confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCertificates();
    this.getStudents();
    this.getCourses();

    this.items = [
      {
        label: 'Certificados',
        icon: 'pi pi-fw pi-book',
        items: [
          {
            label: 'Ver certificados',
            icon: 'pi pi-list',
            command: () => this.showCertificateList(),
          },
          {
            label: 'Crear certificado',
            icon: 'pi pi-plus',
            command: () => this.showCertificateForm(),
          },
        ],
      },
      {
        label: 'Estudiantes',
        icon: 'pi pi-fw pi-user',
        items: [
          {
            label: 'Ver estudiantes',
            icon: 'pi pi-list',
            command: () => this.showStudentList(),
          },
          {
            label: 'Registrar estudiante',
            icon: 'pi pi-plus',
            command: () => this.showStudentForm(),
          },
          {
            label: 'Subir archivo',
            icon: 'pi pi-file',
            command: () => this.showStudentUpload(),
          },
        ],
      },
      {
        label: 'Plantillas',
        icon: 'pi pi-fw pi-file-edit',
        items: [
          {
            label: 'Ver plantillas',
            icon: 'pi pi-list',
            command: () => this.showCoursesList(),
          },
          {
            label: 'Crear plantilla',
            icon: 'pi pi-plus',
            command: () => this.showCourseForm(),
          },
        ],
      },
      {
        label: 'Reportes',
        icon: 'pi pi-fw pi-list',
        items: [
          {
            label: 'Descargar Reporte',
            icon: 'pi pi-file',
            command: () => this.showReportForm(),
          },
        ],
      },
    ];
  }

  ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
  }

  showStudentList() {
    this.showStudents = true;
    this.showCertificates = false;
    this.showCourses = false;
    this.hideButtons = true;
  }

  showCoursesList() {
    this.showStudents = false;
    this.showCertificates = false;
    this.showCourses = true;
    this.hideButtons = true;
  }

  showCertificateList() {
    this.showStudents = false;
    this.showCertificates = true;
    this.showCourses = false;
    this.hideButtons = true;
  }

  getCertificates() {
    this.certificateService
      .get_certificates()
      .subscribe((response: ICertificate[]) => {
        if (response.length > 0) {
          response.splice(0, 1);
          this.certificates = response;
        }
      });
  }

  getStudents() {
    this.certificateService.get_students().subscribe((response: IStudent[]) => {
      this.students = response;
    });
  }

  getCourses() {
    this.certificateService.get_courses().subscribe((response: ICourse[]) => {
      this.courses = response;
      this.loading.next(false);
    });
  }

  registerStudent(data: IStudent) {
    this.loading.next(true);
    this.certificateService
      .create_student([data])
      .subscribe((response: string) => {
        this.loading.next(false);
        this.getStudents();
        this.showSuccessModify = true;
        console.log(response);
      });
  }

  deleteStudent(data: IStudent) {
    this.loading.next(true);
    this.certificateService
      .delete_student(data)
      .subscribe((response: string) => {
        this.loading.next(false);
        this.getStudents();
        this.showSuccessDelete = true;
        console.log(response);
      });
  }

  updateStudent(data: IStudent) {
    this.loading.next(true);
    this.certificateService
      .modify_student(data)
      .subscribe((response: string) => {
        this.loading.next(false);
        this.getStudents();
        this.showSuccessModify = true;
        console.log(response);
      });
  }

  uploadStudent(file: File) {
    this.loading.next(true);
    this.certificateService
      .upload_students(file)
      .subscribe((response: string) => {
        this.loading.next(false);
        this.getStudents();
        this.showSuccess = true;
        console.log(response);
      });
  }

  registerCourse(data: ICourse) {
    this.loading.next(true);
    this.certificateService
      .create_course(data)
      .subscribe((response: string) => {
        this.loading.next(false);
        this.getCourses();
        this.showSuccess = true;
        console.log(response);
      });
  }

  deleteCourse(data: ICourse) {
    this.loading.next(true);
    this.certificateService
      .delete_course(data)
      .subscribe((response: string) => {
        this.loading.next(false);
        this.getCourses();
        this.showSuccessDelete = true;
        console.log(response);
      });
  }

  updateCourse(data: ICourse) {
    this.loading.next(true);
    this.certificateService
      .modify_course(data)
      .subscribe((response: string) => {
        this.loading.next(false);
        this.getCourses();
        this.showSuccessModify = true;
        console.log(response);
      });
  }

  registerCertificate(data: ICertificate) {
    this.loading.next(true);
    this.certificateService
      .create_certificate(data)
      .subscribe((response: string) => {
        this.loading.next(false);
        this.getCertificates();
        this.showSuccess = true;
        console.log(response);
      });
  }

  requestReport(data: IReportRequest) {
    this.loading.next(true);
    this.certificateService
      .download_report(data)
      .subscribe((response: Blob) => {
        try {
          this.loading.next(false);
          const url = window.URL.createObjectURL(response);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'report.csv';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          this.showSuccess = true;
        } catch (e) {
          alert('error downloading report ' + e);
        }
      });
  }

  showStudentForm() {
    this.ref = this.dialogService.open(StudentsFormComponent, {
      data: {
        edit: false,
        currentStudent: undefined,
        loading: this.loading.value,
        students: this.students,
        registerData: (data: IStudent) => {
          this.registerStudent(data);
          this.ref?.close();
        },
      },
      header: 'Registrar estudiante',
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
    });
  }

  showStudentFormEdit(student: IStudent) {
    if (!this.checkEmmitedStudent(student)) {
      this.ref = this.dialogService.open(StudentsFormComponent, {
        data: {
          edit: true,
          currentStudent: student,
          loading: this.loading.value,
          students: this.students,
          registerData: (data: IStudent) => {
            this.updateStudent({ ...data, idstudent: student.idstudent });
            this.ref?.close();
          },
        },
        header: 'Editar estudiante',
        width: '70%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
      });
    } else {
      this.showNotAllowed = true;
    }
  }

  showStudentUpload() {
    this.ref = this.dialogService.open(StudentsUploadComponent, {
      data: {
        loading: this.loading.value,
        uploadStudent: (data: File) => {
          this.uploadStudent(data);
          this.ref?.close();
        },
      },
      header: 'Subir archivo de estudiantes',
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
    });
  }

  showCourseForm() {
    this.ref = this.dialogService.open(CourseFormComponent, {
      data: {
        edit: false,
        currentCourse: undefined,
        loading: this.loading.value,
        templates: this.courses,
        registerData: (data: ICourse) => {
          this.registerCourse(data);
          this.ref?.close();
        },
      },
      header: 'Registrar plantilla de curso',
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
    });
  }

  showCourseFormEdit(course: ICourse) {
    if (!this.checkEmmitedCourse(course)) {
      this.ref = this.dialogService.open(CourseFormComponent, {
        data: {
          edit: true,
          currentCourse: course,
          loading: this.loading.value,
          templates: this.courses,
          registerData: (data: ICourse) => {
            this.updateCourse({ ...data, idcourse: course.idcourse });
            this.ref?.close();
          },
        },
        header: 'Editar plantilla de curso',
        width: '70%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
      });
    } else {
      this.showNotAllowed = true;
    }
  }

  showCertificateForm() {
    this.ref = this.dialogService.open(CertificateFormComponent, {
      data: {
        students: this.students,
        templates: this.courses,
        loading: this.loading.value,
        registerData: (data: ICertificate) => {
          this.registerCertificate(data);
          this.ref?.close();
        },
      },
      header: 'Registrar certificado',
      height: '80%',
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
    });
  }

  showReportForm() {
    this.ref = this.dialogService.open(ReportFormComponent, {
      data: {
        students: this.students,
        templates: this.courses,
        certificates: this.certificates,
        loading: this.loading.value,
        requestReport: (data: IReportRequest) => this.requestReport(data),
      },
      header: 'Descargar reporte en csv',
      height: '80%',
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
    });
  }

  showCertificateImage(certificate: ICertificate) {
    this.ref = this.dialogService.open(CertificateValidateModalComponent, {
      data: {
        certificate: certificate,
      },
      header: 'Ver/Descargar Certificado',
      height: '100%',
      width: '80%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
    });
  }

  confirm(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Quieres cerrar sesión?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Si',
      accept: () => {
        // Store login information in local storage
        localStorage.setItem('isLoggedIn', '');
        // Redirect to login page
        this.router.navigate(['/login']);
      },
    });
  }

  confirmDeleteStudent(data: IStudent) {
    if (!this.checkEmmitedStudent(data)) {
      this.confirmationService.confirm({
        message: 'Seguro que desea eliminar el estudiante?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.deleteStudent(data);
        },
        acceptLabel: 'Si',
        key: 'deleteDialog',
      });
    } else {
      this.showNotAllowed = true;
    }
  }

  confirmDeleteCourse(data: ICourse) {
    if (!this.checkEmmitedCourse(data)) {
      this.confirmationService.confirm({
        message: 'Seguro que desea eliminar la plantilla?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.deleteCourse(data);
        },
        key: 'deleteDialog',
      });
    } else {
      this.showNotAllowed = true;
    }
  }

  checkEmmitedStudent(student: IStudent) {
    return Boolean(
      this.certificates.find((cert) => cert.student.dni === student.dni)
    );
  }

  checkEmmitedCourse(course: ICourse) {
    return Boolean(
      this.certificates.find((cert) => cert.course.title === course.title)
    );
  }
}
