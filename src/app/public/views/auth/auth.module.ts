import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AuthRoutingModule} from './auth-routing.module';
import { SignupComponent } from './signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ValidationErrorComponent } from '../../../shared/components/validation-error/validation-error.component';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { SigninComponent } from './signin/signin.component';
import { DoctorSignupComponent } from './doctor-signup/doctor-signup.component';




@NgModule({
  declarations: [
    SigninComponent,
    SignupComponent,
    DoctorSignupComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ValidationErrorComponent,
    SpinnerComponent,
    AlertComponent
    
  ],
  exports: [
    SigninComponent,
    SignupComponent,
    DoctorSignupComponent
  ],
 
})
export class AuthModule { }
