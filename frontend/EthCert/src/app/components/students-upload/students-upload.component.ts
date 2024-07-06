import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { IStudent } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-students-upload',
  templateUrl: './students-upload.component.html',
  styleUrls: ['./students-upload.component.scss']
})
export class StudentsUploadComponent implements OnInit {
  studentExamples: IStudent[] = [];

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

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
    const file: File = event.files[0];

    if (file) {
      this.config.data.uploadStudent(file);
    }
  }
}
