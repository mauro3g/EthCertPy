import { TestBed } from '@angular/core/testing';

import { CertificatesServiceService } from './certificates-service.service';

describe('CertificatesServiceService', () => {
  let service: CertificatesServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CertificatesServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
