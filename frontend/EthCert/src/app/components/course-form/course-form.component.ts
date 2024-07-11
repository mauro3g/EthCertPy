import { Component } from '@angular/core';
import {
  FormGroup,
  Validators,
  UntypedFormBuilder,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { ICourse } from 'src/app/interfaces/interfaces';
import { isValidCI, titleInUse } from 'src/app/utils/dniFormatter';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss'],
})
export class CourseFormComponent {
  public onClose: Subject<boolean> = new Subject();
  formCourse!: FormGroup;

  loading: boolean = false;
  titleInUse: boolean = false;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private readonly fb: UntypedFormBuilder
  ) {
    this.formCourse = this.fb.group({
      title: ['', [Validators.required, this.titleValidator()]],
      description: ['', [Validators.required]],
      institution: ['', [Validators.required]],
      duration: ['', [Validators.required]],
      date: ['', [Validators.required]],
    });
  }

  titleValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const title = control.value;

      // Verificar que el DNI no esté en la lista de estudiantes
      if (titleInUse(this.config.data.templates, title)) {
        this.titleInUse = true;
        return { titleInUse: { value: control.value } };
      }
      this.titleInUse = false;
      return null;
    };
  }

  doCreate(body: ICourse) {
    this.config.data.registerData(body);
    this.ref.close();
  }

  submit() {
    let dateParse: Date = this.formCourse.value.date;
    let durationValue: String = this.formCourse.value.duration + ' horas';
    this.doCreate({
      ...this.formCourse.value,
      duration: durationValue,
      date: dateParse.toLocaleDateString(),
    });
  }
}
