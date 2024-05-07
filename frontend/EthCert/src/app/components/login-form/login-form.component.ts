import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ILogin } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {
  @Input() loading: boolean = false
  @Output() login: EventEmitter<ILogin> = new EventEmitter();
  formLogin: FormGroup  = new FormGroup({
    user: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  })

  submit() {
    this.login.emit(this.formLogin.value);
  }
}
