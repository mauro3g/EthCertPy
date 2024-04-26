import { Component, OnInit } from '@angular/core';
import { CertificatesServiceService } from '../../services/certificates-service.service';
import { ICertificate, IStudent } from 'src/app/interfaces/interfaces';
import { MegaMenuItem } from 'primeng/api';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  items: MegaMenuItem[] = [];
  students: IStudent[] = [];

  constructor(
    private readonly certificateService: CertificatesServiceService
  ) {}

  ngOnInit(): void {
    this.certificateService
      .get_certificates()
      .subscribe((response: ICertificate[]) => {
        console.log(response, 'res');
      });

    this.certificateService
      .get_students()
      .subscribe((response: IStudent[]) => {
        this.students = response
      });

    this.items = [
      {
        label: 'Certificados',
        icon: 'pi pi-fw pi-book',
        items: [
          [
            {
              label: 'Certificados',
              items: [
                {
                  label: 'Ver certificados',
                  icon: 'pi pi-list',
                },
                {
                  label: 'Crear certificado',
                  icon: 'pi pi-plus',
                },
              ],
            },
          ],
        ],
      },
      {
        label: 'Estudiantes',
        icon: 'pi pi-fw pi-user',
        items: [
          [
            {
              label: 'Estudiantes',
              items: [
                {
                  label: 'Ver estudiantes',
                  icon: 'pi pi-list',
                },
                {
                  label: 'Registrar estudiante',
                  icon: 'pi pi-plus',
                },
              ],
            },
          ],
        ],
      },
      {
        label: 'Estudiantes',
        icon: 'pi pi-fw pi-file-edit',
        items: [
          [
            {
              label: 'Plantillas',
              items: [
                {
                  label: 'Ver plantillas',
                  icon: 'pi pi-list',
                },
                {
                  label: 'Crear plantilla',
                  icon: 'pi pi-plus',
                },
              ],
            },
          ],
        ],
      },
    ];
  }
}
