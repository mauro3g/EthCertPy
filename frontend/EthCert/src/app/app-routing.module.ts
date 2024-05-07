import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './screens/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './screens/login/login.component';
import { ValidateComponent } from './screens/validate/validate.component';

const routes: Routes = [
  {path: '', component: ValidateComponent},
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
