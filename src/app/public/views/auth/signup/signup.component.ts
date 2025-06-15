import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { CommonService } from '../../../../_core/services/common.service';
import { Router } from '@angular/router';
import { DatetimeHelper } from '../../../../_core/helpers/datetime.helper';
import { PublicRoutes } from '../../../public.routes';
import { Alert, AlertType } from '../../../../shared/components/alert/alert.type';
import { RegistrationResponse } from '../auth-models';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-signup',
  standalone: false,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  //readonly signupbannerImage:string = Images.auth.signup
  isLoading: boolean = false;
  readonly currentYear: number = DatetimeHelper.currentYear;
  readonly publicRoutes = PublicRoutes;
  showErrors = false
  readonly alertType = AlertType;
  alert = this.alertType.Info
  showAlert = false
  alertMsg = ""

  signUpForm: FormGroup

  constructor(
    public commonService: CommonService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { 
    this.signUpForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      repassword: ['', [this.passwordValidator(), Validators.required]],
    });
  }

  onFormSubmitHandler = (event: SubmitEvent) => {
    
    event.preventDefault();

    if(this.signUpForm.valid){
        this.register()
    }else{
      this.showErrors = true
    }
  
    // this.isLoading = true;

    setTimeout(() => {
      this.isLoading = false;
      this.showErrors = false
      //this.router.navigate([AppRoutes.Admin, AdminRoutes.Dashboard]);
    }, 3000);
  }
  register(){
    const payload: RegistrationResponse = {
      email: this.signUpForm.value["email"],
      password: this.signUpForm.value["password"]
    }
    this.authService.signUp(payload).pipe(
      finalize (() => {
        this.commonService.updateAlert({
          message: this.alertMsg,
          alertType: this.alert,
          show: true
        })
      })
    ).subscribe({
      next: data => {
          if(data.isError){
            this.alert = AlertType.Danger
            
          }else{
            this.alert = AlertType.Success
          }
          this.alertMsg = data.message
          
      },error: e => {
        console.log(e)
        this.alert = AlertType.Danger
        this.alertMsg = e.error.message
      }
    })
  }
   passwordValidator():  ValidationErrors|  null {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const contraseña = control.parent?.get('password');
      const confirmar = control.parent?.get('repassword');
  
      if (!contraseña || !confirmar) {
        return null;
      }
  
      return contraseña.value === confirmar.value ? null : { confirmPassword: true };
    };
}

showAlertElement(){
  this.showAlert = true;
  setTimeout(() => {
    this.showAlert = false
  }, 4000);
  
}

}
