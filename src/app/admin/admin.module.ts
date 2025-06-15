import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AdminRoutingModule } from './admin-routing.module';


import { AdminComponent } from './admin.component';
import { AdminPageNotFoundComponent } from './views/admin-page-not-found/admin-page-not-found.component';

import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { LayoutsModule } from './layouts/layouts.module';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { PatientsComponent } from './views/patients/patients.component';
import { DoctorsComponent } from './views/doctors/doctors.component';
import { AppointmentsComponent } from './views/appointments/appointments.component';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { HeaderComponent } from './layouts/header/header.component';





@NgModule({

  declarations: [
   AdminComponent
  
    
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    LayoutsModule,
 
 
],
 
 
})
export class AdminModule { }
