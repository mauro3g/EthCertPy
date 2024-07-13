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
import { FileUploadModule } from 'primeng/fileupload';
import { LoginFormComponent } from './login-form/login-form.component';
import { CertificateSearchComponent } from './certificate-search/certificate-search.component';
import { CertificateValidateComponent } from './certificate-validate/certificate-validate.component';
import { CertificateValidateModalComponent } from './certificate-validate/certificate-validate-modal.component';
import { StudentsUploadComponent } from './students-upload/students-upload.component';
import { ReportFormComponent } from './report-form/report-form.component';

@NgModule({
  declarations: [
    StudentsListComponent,
    StudentsFormComponent,
    CourseListComponent,
    CourseFormComponent,
    CertificateListComponent,
    CertificateFormComponent,
    LoginFormComponent,
    CertificateSearchComponent,
    CertificateValidateComponent,
    CertificateValidateModalComponent,
    StudentsUploadComponent,
    ReportFormComponent,
  ],
  imports: [CommonModule, PrimengModule, ReactiveFormsModule, FormsModule, FileUploadModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    StudentsListComponent,
    StudentsFormComponent,
    CourseListComponent,
    CourseFormComponent,
    CertificateListComponent,
    CertificateFormComponent,
    LoginFormComponent,
    CertificateSearchComponent,
    CertificateValidateComponent,
    CertificateValidateModalComponent,
    StudentsUploadComponent,
    ReportFormComponent
  ],
})
export class ComponentsModule {}
