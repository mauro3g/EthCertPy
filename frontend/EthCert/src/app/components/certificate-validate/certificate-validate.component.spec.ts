import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateValidateComponent } from './certificate-validate.component';

describe('CertificateValidateComponent', () => {
  let component: CertificateValidateComponent;
  let fixture: ComponentFixture<CertificateValidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertificateValidateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificateValidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
