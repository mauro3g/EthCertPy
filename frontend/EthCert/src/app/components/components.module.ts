import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentsListComponent } from './students-list/students-list.component';
import { StudentsFormComponent } from './students-form/students-form.component';
import { CourseListComponent } from './course-list/course-list.component';
import { CourseFormComponent } from './course-form/course-form.component';
import { CertificateListComponent } from './certificate-list/certificate-list.component';
import { CertificateFormComponent } from './certificate-form/certificate-form.component';
import { PrimengModule } from '../modules/primeng/primeng.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    StudentsListComponent,
    StudentsFormComponent,
    CourseListComponent,
    CourseFormComponent,
    CertificateListComponent,
    CertificateFormComponent,
  ],
  imports: [CommonModule, PrimengModule, ReactiveFormsModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    StudentsListComponent,
    StudentsFormComponent,
    CourseListComponent,
    CourseFormComponent,
    CertificateListComponent,
    CertificateFormComponent,
  ],
})
export class ComponentsModule {}
