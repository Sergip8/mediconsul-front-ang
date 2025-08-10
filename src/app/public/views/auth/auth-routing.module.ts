import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {SignupComponent} from "./signup/signup.component";
import {SigninComponent} from "./signin/signin.component";
import { PublicRoutes } from '../../public.routes';
import { DoctorSignupComponent } from './doctor-signup/doctor-signup.component';

const routes: Routes = [
  {
    title: "Signin",
    path: PublicRoutes.Signup,
    component: SignupComponent
  },
    {
      title: "Signup",
      path: PublicRoutes.Signin,
      component: SigninComponent
    },
    {
      title: "Doctor Signup",
      path: PublicRoutes.DoctorSignup,
      component: DoctorSignupComponent
    },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
