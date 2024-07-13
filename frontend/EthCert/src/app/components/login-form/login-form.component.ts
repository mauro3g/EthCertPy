import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ILogin } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent {
  @Input() loading: boolean = false;
  @Output() login: EventEmitter<ILogin> = new EventEmitter();

  constructor(private router: Router) {}

  formLogin: FormGroup = new FormGroup({
    user: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  goHome() {
    this.router.navigate(['/']);
  }

  submit() {
    this.login.emit(this.formLogin.value);
  }
}
