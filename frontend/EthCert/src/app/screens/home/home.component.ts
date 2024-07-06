import { Component, OnInit } from '@angular/core';
import { CertificatesServiceService } from '../../services/certificates-service.service';
import {
  ICertificate,
  ICourse,
  IReportRequest,
  IStudent,
} from 'src/app/interfaces/interfaces';
import { ConfirmationService, MegaMenuItem } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { StudentsFormComponent } from 'src/app/components/students-form/students-form.component';
import { BehaviorSubject } from 'rxjs';
import { CourseFormComponent } from 'src/app/components/course-form/course-form.component';
import { CertificateFormComponent } from 'src/app/components/certificate-form/certificate-form.component';
import { Router } from '@angular/router';
import { StudentsUploadComponent } from '../../components/students-upload/students-upload.component';
import { ReportFormComponent } from 'src/app/components/report-form/report-form.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [DialogService, MessageService, ConfirmationService],
})
export class HomeComponent implements OnInit {
  items: MegaMenuItem[] = [];
  students: IStudent[] = [];
  certificates: ICertificate[] = [];
  courses: ICourse[] = [];
  ref: DynamicDialogRef | undefined;
  showStudents: boolean = false;
  showCertificates: boolean = false;
  showCourses: boolean = false;
  showSuccess: boolean = false;
  showError: boolean = false;
  loading = new BehaviorSubject<boolean>(false);
  loadingTables = new BehaviorSubject<boolean>(true);

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
          [
            {
              label: 'Certificados',
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
          ],
        ],
      },
      {
        label: 'Estudiantes',
        icon: 'pi pi-fw pi-user',
        items: [
          [
            {
              label: 'Estudiantes',
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
          ],
        ],
      },
      {
        label: 'Plantillas',
        icon: 'pi pi-fw pi-file-edit',
        items: [
          [
            {
              label: 'Plantillas',
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
          ],
        ],
      },
      {
        label: 'Reportes',
        icon: 'pi pi-fw pi-list',
        items: [
          [
            {
              label: 'Reportes',
              items: [
                {
                  label: 'Descargar Reporte',
                  icon: 'pi pi-file',
                  command: () => this.showReportForm(),
                },
              ],
            },
          ],
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
  }

  showCoursesList() {
    this.showStudents = false;
    this.showCertificates = false;
    this.showCourses = true;
  }

  showCertificateList() {
    this.showStudents = false;
    this.showCertificates = true;
    this.showCourses = false;
  }

  getCertificates() {
    this.certificateService
      .get_certificates()
      .subscribe((response: ICertificate[]) => {
        if (response.length > 0) {
          response.splice(0, 1);
          this.certificates = response;
          this.showCertificateList();
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
        this.showSuccess = true;
        console.log(response);
      });
  }

  uploadStudent(file: File) {
    console.log('asdas')
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
        loading: this.loading.value,
        registerData: (data: IStudent) => this.registerStudent(data),
      },
      header: 'Registrar estudiante',
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
    });
  }

  showStudentUpload() {
    this.ref = this.dialogService.open(StudentsUploadComponent, {
      data: {
        loading: this.loading.value,
        uploadStudent: (data: File) => this.uploadStudent(data),
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
        loading: this.loading.value,
        registerData: (data: ICourse) => this.registerCourse(data),
      },
      header: 'Registrar plantilla de curso',
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
    });
  }

  showCertificateForm() {
    this.ref = this.dialogService.open(CertificateFormComponent, {
      data: {
        students: this.students,
        templates: this.courses,
        loading: this.loading.value,
        registerData: (data: ICertificate) => this.registerCertificate(data),
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

  confirm(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Quieres cerrar sesión?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // Store login information in local storage
        localStorage.setItem('isLoggedIn', '');
        // Redirect to login page
        this.router.navigate(['/login']);
      },
    });
  }
}
