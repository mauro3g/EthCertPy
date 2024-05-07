import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-certificate-search',
  templateUrl: './certificate-search.component.html',
  styleUrls: ['./certificate-search.component.scss']
})
export class CertificateSearchComponent {
  @Input() loading: boolean = false
  @Output() searchCertificate: EventEmitter<string> = new EventEmitter();
  formSearch: FormGroup  = new FormGroup({
    searchData: new FormControl('', [Validators.required]),
  })

  submit() {
    this.searchCertificate.emit(this.formSearch.value.searchData);
  }

}
