import { Component, OnInit } from '@angular/core';
import { CertificatesServiceService } from '../../services/certificates-service.service';
import { ICertificate, ICourse, IStudent } from 'src/app/interfaces/interfaces';
import { MegaMenuItem } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { StudentsFormComponent } from 'src/app/components/students-form/students-form.component';
import { BehaviorSubject } from 'rxjs';
import { CourseFormComponent } from 'src/app/components/course-form/course-form.component';
import { CertificateFormComponent } from 'src/app/components/certificate-form/certificate-form.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [DialogService, MessageService],
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
  loading = new BehaviorSubject<boolean>(false);
  loadingTables = new BehaviorSubject<boolean>(true);

  constructor(
    private readonly certificateService: CertificatesServiceService,
    public dialogService: DialogService,
    public messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.certificateService
      .get_certificates()
      .subscribe((response: ICertificate[]) => {
        this.certificates = response;
        this.showCertificateList()
      });

    this.certificateService.get_students().subscribe((response: IStudent[]) => {
      this.students = response;
    });

    this.certificateService.get_courses().subscribe((response: ICourse[]) => {
      this.courses = response;
      this.loading.next(false);
    });

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

  registerStudent(data: IStudent) {
    this.loading.next(true);
    this.certificateService
      .create_student([data])
      .subscribe((response: string) => {
        this.loading.next(false);
        console.log(response);
      });
  }

  registerCourse(data: ICourse) {
    this.loading.next(true);
    this.certificateService
      .create_course([data])
      .subscribe((response: string) => {
        this.loading.next(false);
        console.log(response);
      });
  }

  registerCertificate(data: ICertificate) {
    this.loading.next(true);
    this.certificateService
      .create_certificate(data)
      .subscribe((response: string) => {
        this.loading.next(false);
        console.log(response);
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

    this.ref.onClose.subscribe((student: IStudent) => {
      if (student) {
        this.messageService.add({
          severity: 'info',
          summary: 'Product Selected',
          detail: student.name,
        });
      }
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
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
    });
  }
}
