import { Component, Input } from '@angular/core';
import { SortEvent } from 'primeng/api';
import { ICertificate } from 'src/app/interfaces/interfaces';
import { DateFormatterUtil } from 'src/app/utils/dateFormatter';

@Component({
  selector: 'app-certificate-list',
  templateUrl: './certificate-list.component.html',
  styleUrls: ['./certificate-list.component.scss']
})
export class CertificateListComponent  extends DateFormatterUtil {
  @Input() certificates: ICertificate[] = [];

  customSort(event: SortEvent) {
      event.data?.sort((data1, data2) => {
          let value1 = data1[event.field ?? ''];
          let value2 = data2[event.field ?? ''];
          let result = null;

          if (value1 == null && value2 != null) result = -1;
          else if (value1 != null && value2 == null) result = 1;
          else if (value1 == null && value2 == null) result = 0;
          else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2);
          else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

          return (event.order ?? 0) * result;
      });
  }
}
