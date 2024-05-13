import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
  formCourse: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    institution: new FormControl('', [Validators.required]),
    duration: new FormControl('', [Validators.required]),
    date: new FormControl('', [Validators.required]),
  });

  loading: boolean = false;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {}

  doCreate(body: ICourse) {
    this.config.data.registerData(body);
    this.ref.close();
  }

  submit() {
    let dateParse: Date = this.formCourse.value.date;
    this.doCreate({
      ...this.formCourse.value,
      date: dateParse.toLocaleDateString(),
    });
  }
}
