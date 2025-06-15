import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { UserProfileComponent } from './views/user-profile/user-profile.component';
import { PatientAppointmentsComponent } from './views/patient-appointments/patient-appointments.component';
import { DoctorCalendarComponent } from './views/doctor-calendar/doctor-calendar.component';
import { AppointmentPageComponent } from './views/appointment-page/appointment-page.component';
import { ChatFeatureComponent } from './views/chat/chat.component';
import { AppointmentRegisterComponent } from './views/citas/appointment-register/appointment-register.component';



const routes: Routes = [

  {
    path: '',
    title: 'Home',
    component: HomeComponent,
  },
  {
    path: 'profile',
    title: 'profile',
    component: UserProfileComponent
  },
  {
    path: 'appointments',
    title: 'appointments',
    component: PatientAppointmentsComponent
  },
  {
    path: 'calendar',
    title: 'calendar',
    component: DoctorCalendarComponent
  },
  {
    path: 'search-appment/:speName/:speId',
    title: 'search-appment',
    component: AppointmentPageComponent
  },
  {
    path: 'chat',
    title: 'chat',
    component: ChatFeatureComponent
  },
  {
    path: 'set-appointment',
    title: 'set-appointment',
    component: AppointmentRegisterComponent
  },


  // {
  //   path: '',
  //   loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicRoutingModule {}
