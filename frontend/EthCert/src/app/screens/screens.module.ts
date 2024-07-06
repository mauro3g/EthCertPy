import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ValidateComponent } from './validate/validate.component';
import { PrimengModule } from '../modules/primeng/primeng.module';
import { ComponentsModule } from '../components/components.module';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

@NgModule({
  declarations: [HomeComponent, LoginComponent, ValidateComponent],
  imports: [PrimengModule, ComponentsModule, ButtonModule, ToastModule, ConfirmPopupModule],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ScreensModule {}
