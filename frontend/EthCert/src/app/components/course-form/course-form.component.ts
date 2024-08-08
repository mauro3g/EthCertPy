import { Component } from '@angular/core';
import { FormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { ICourse } from 'src/app/interfaces/interfaces';

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
  minDate = new Date();
  edit: boolean = false;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private readonly fb: UntypedFormBuilder
  ) {
    const currentCourse = this.config.data.currentCourse;
    this.edit = this.config.data.edit;
    if (this.edit && currentCourse) {
      this.formCourse = this.fb.group({
        title: [currentCourse.title, [Validators.required]],
        description: [currentCourse.description, [Validators.required]],
        institution: [currentCourse.institution, [Validators.required]],
        duration: ['1', [Validators.required]],
        date: ['', [Validators.required]],
      });
    } else {
      this.formCourse = this.fb.group({
        title: ['', [Validators.required]],
        description: ['', [Validators.required]],
        institution: ['', [Validators.required]],
        duration: ['1', [Validators.required]],
        date: ['', [Validators.required]],
      });
    }
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
