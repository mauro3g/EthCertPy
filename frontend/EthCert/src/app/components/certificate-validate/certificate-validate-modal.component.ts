import { Component } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CertificateValidateComponent } from './certificate-validate.component';

@Component({
  selector: 'app-certificate-validate-modal',
  templateUrl: './certificate-validate.component.html',
  styleUrls: ['./certificate-validate.component.scss'],
})
export class CertificateValidateModalComponent extends CertificateValidateComponent {

  constructor(
    public config?: DynamicDialogConfig
  ) {
    super();

    this.certificate = this.certificate ?? config?.data.certificate;
  }
}
