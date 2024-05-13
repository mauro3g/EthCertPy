import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { IStudent } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-students-form',
  templateUrl: './students-form.component.html',
  styleUrls: ['./students-form.component.scss'],
})
export class StudentsFormComponent {
  public onClose: Subject<boolean> = new Subject();
  formStudent: FormGroup  = new FormGroup({
    name: new FormControl('', [Validators.required]),
    surname: new FormControl('', [Validators.required]),
    dni: new FormControl('', [Validators.required]),
  })

  loading: boolean = false;

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig ) {}

  doCreate(body: IStudent) {
    this.config.data.registerData(body)
    this.ref.close();
  }

  submit() {
    this.doCreate(this.formStudent.value);
  }
}
