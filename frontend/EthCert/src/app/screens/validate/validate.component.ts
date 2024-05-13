import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ICertificate } from 'src/app/interfaces/interfaces';
import { CertificatesServiceService } from 'src/app/services/certificates-service.service';

@Component({
  selector: 'app-validate',
  templateUrl: './validate.component.html',
  styleUrls: ['./validate.component.scss'],
})
export class ValidateComponent {
  certificate?: ICertificate;
  loading = new BehaviorSubject<boolean>(false);
  showResult = new BehaviorSubject<boolean>(false);
  notFound = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly certificateService: CertificatesServiceService
  ) {}

  handleSearch(search: string) {
    console.log(search)
    this.loading.next(true);
    this.certificateService
      .get_certificate(search)
      .subscribe((response: ICertificate[]) => {
        if (response.length > 0) this.certificate = response[0];
        if (this.certificate?.idcertificate === 0) {
          this.notFound.next(true)
          this.showResult.next(false);
        } else{
          this.notFound.next(false)
          this.showResult.next(true);
        }
        this.loading.next(false);
      });
  }
}
