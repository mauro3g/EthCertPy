import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { IStudent } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-students-upload',
  templateUrl: './students-upload.component.html',
  styleUrls: ['./students-upload.component.scss'],
  providers: [MessageService],
})
export class StudentsUploadComponent implements OnInit {
  studentExamples: IStudent[] = [];

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.studentExamples.push({
      name: 'Juan',
      surname: 'Peres',
      dni: '1745652312',
    });
    this.studentExamples.push({
      name: 'Maria',
      surname: 'Morales',
      dni: '1986552312',
    });
    this.studentExamples.push({
      name: 'Alex',
      surname: 'Rodriguez',
      dni: '0956478931',
    });
  }

  onUpload(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('file', file, file.name);
    }
    this.messageService.add({
      severity: 'info',
      summary: 'Success',
      detail: 'Archivo subido',
    });
  }
}
