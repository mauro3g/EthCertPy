import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ILogin } from 'src/app/interfaces/interfaces';
import { CertificatesServiceService } from 'src/app/services/certificates-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loading: boolean = false;

  constructor(
    private readonly certificateService: CertificatesServiceService,
    private router: Router
  ) {}

  handleLogin(data: ILogin) {
    this.loading = true;
    this.certificateService.login(data).subscribe((response: ILogin) => {
      if (response) {
        // Store login information in local storage
        localStorage.setItem('isLoggedIn', 'true');
        // Redirect to home page
        this.router.navigate(['/home']);
        this.loading = false;
      }
    });
  }
}
