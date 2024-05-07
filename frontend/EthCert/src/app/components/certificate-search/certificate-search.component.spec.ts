import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateSearchComponent } from './certificate-search.component';

describe('CertificateSearchComponent', () => {
  let component: CertificateSearchComponent;
  let fixture: ComponentFixture<CertificateSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertificateSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificateSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
