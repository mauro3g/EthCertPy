import { Component, Input } from '@angular/core';
import { ICertificate } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-certificate-validate',
  templateUrl: './certificate-validate.component.html',
  styleUrls: ['./certificate-validate.component.scss']
})
export class CertificateValidateComponent {

  @Input() certificate?: ICertificate;

}
