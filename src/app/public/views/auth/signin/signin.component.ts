import { Component, EventEmitter, Output } from '@angular/core';
import { PublicRoutes } from '../../../public.routes';
import { DatetimeHelper } from '../../../../_core/helpers/datetime.helper';
import { AlertType } from '../../../../shared/components/alert/alert.type';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../../../_core/services/common.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { LoginRequest, LoginResponse } from '../auth-models';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-signin',
  standalone: false,
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {
  //readonly signinBannerImage: string = Images.bannerLogo;

  isLoading: boolean = false;
  readonly publicRoutes = PublicRoutes;
  readonly currentYear: number = DatetimeHelper.currentYear;

  serverErrors: string[] = [];
  showErrors = false
  readonly alertType = AlertType;
  alert = this.alertType.Info
  showAlert = false
  alertMsg = ""

  @Output() loginSuccess = new EventEmitter<void>()


  signInForm: FormGroup

  constructor(
    public commonService: CommonService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.signInForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  protected readonly AlertType = AlertType;

  protected onFormSubmitHandler = (event: SubmitEvent) => {
    if(this.signInForm.valid){
      this.login()
  }else{
    this.showErrors = true
  }
    // event.preventDefault();
    // this.isLoading = true;

    setTimeout(() => {
      this.isLoading = false;
      this.showErrors = false
      //this.router.navigate([AppRoutes.Admin, AdminRoutes.Dashboard]);
    }, 3000);
  };

  protected onAlertCloseHandler = (e: any) => {
    this.serverErrors = [];
  };
  login(){
    
    this.authService.signIn(<LoginResponse>this.signInForm.value).pipe(
          finalize (() => {
            this.commonService.updateAlert({
              message: this.alertMsg,
              alertType: this.alert,
              show: true
            })
          })
        ).subscribe({
      next: data => {
        console.log(data)
          if(data.isError){
            this.alert = AlertType.Danger
          }else{
            this.authService.updateUser(<LoginRequest>data)
            this.alert = AlertType.Success
            this.authService.updateUser(data)
            
          }
          this.alertMsg = data.message
          this.router.navigate([""])

      },error: e => {
        console.log(e)
        this.alert = AlertType.Danger
        this.alertMsg = e.error.message
      }
    })
  }
  showAlertElement(){
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false
      if(this.alert === AlertType.Success){
        this.loginSuccess.emit()
      }
    }, 2000);
    
  }
}
