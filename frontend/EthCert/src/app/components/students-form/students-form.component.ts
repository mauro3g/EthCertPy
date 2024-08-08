import { Component } from '@angular/core';
import {
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
  UntypedFormBuilder,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { IStudent } from 'src/app/interfaces/interfaces';
import { dniInUse, isValidCI } from 'src/app/utils/dniFormatter';

@Component({
  selector: 'app-students-form',
  templateUrl: './students-form.component.html',
  styleUrls: ['./students-form.component.scss'],
})
export class StudentsFormComponent {
  public onClose: Subject<boolean> = new Subject();
  formStudent!: FormGroup;

  loading: boolean = false;
  invalidCi: boolean = false;
  dniInUse: boolean = false;
  edit: boolean = false;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private readonly fb: UntypedFormBuilder
  ) {
    const currentStudent = this.config.data.currentStudent;
    this.edit = this.config.data.edit;
    if (this.edit && currentStudent) {
      this.formStudent = this.fb.group({
        name: [currentStudent.name, [Validators.required]],
        surname: [currentStudent.surname, [Validators.required]],
        dni: [currentStudent.dni, [Validators.required, this.dniValidator()]],
        country: [currentStudent.country, []],
        phone: [currentStudent.phone, []],
        direction: [currentStudent.direction, []],
      });
    } else {
      this.formStudent = this.fb.group({
        name: ['', [Validators.required]],
        surname: ['', [Validators.required]],
        dni: ['', [Validators.required, this.dniValidator()]],
        country: ['', []],
        phone: ['', []],
        direction: ['', []],
      });
    }
  }

  dniValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const dni = control.value;

      // Verificar que el DNI no esté en la lista de estudiantes
      if (dniInUse(this.config.data.students, dni)) {
        this.dniInUse = true;
        return { dniInUse: { value: control.value } };
      }

      // Verificar formato de cédula ecuatoriana
      if (!isValidCI(dni)) {
        this.invalidCi = true;
        return { invalidFormat: { value: control.value } };
      }

      this.invalidCi = false;
      this.dniInUse = false;

      return null;
    };
  }

  doCreate(body: IStudent) {
    this.config.data.registerData(body);
    this.ref.close();
  }

  submit() {
    this.doCreate(this.formStudent.value);
  }
}
