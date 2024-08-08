import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SortEvent } from 'primeng/api';
import { ICertificate } from 'src/app/interfaces/interfaces';
import { DateFormatterUtil } from 'src/app/utils/dateFormatter';

@Component({
  selector: 'app-certificate-list',
  templateUrl: './certificate-list.component.html',
  styleUrls: ['./certificate-list.component.scss'],
})
export class CertificateListComponent extends DateFormatterUtil {
  @Input() certificates: ICertificate[] = [];
  @Output() viewCertificate: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {
    this.certificates.forEach((cert) => {
      cert.issuedDate = new Date(cert.issuedDate).toLocaleDateString();
      cert.expireDate = new Date(cert.expireDate).toLocaleDateString();
    });
  }

  handleViewCertificate(certificate: ICertificate) {
    this.viewCertificate.emit(certificate);
  }

  validateExpireDate(expireDate: any) {
    if (expireDate === 0 || expireDate.toString().includes('1969')) {
      return 'No expira';
    }
    return this.formatDate(expireDate);
  }

  customSort(event: SortEvent) {
    event.data?.sort((data1, data2) => {
      let value1 = data1[event.field ?? ''];
      let value2 = data2[event.field ?? ''];
      let result = null;

      if (value1 == null && value2 != null) result = -1;
      else if (value1 != null && value2 == null) result = 1;
      else if (value1 == null && value2 == null) result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string')
        result = value1.localeCompare(value2);
      else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

      return (event.order ?? 0) * result;
    });
  }
}
