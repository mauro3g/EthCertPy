import { Component, Input } from '@angular/core';
import { ICertificate } from 'src/app/interfaces/interfaces';
import { DateFormatterUtil } from 'src/app/utils/dateFormatter';

@Component({
  selector: 'app-certificate-validate',
  templateUrl: './certificate-validate.component.html',
  styleUrls: ['./certificate-validate.component.scss']
})
export class CertificateValidateComponent extends DateFormatterUtil {

  @Input() certificate?: ICertificate;

}
