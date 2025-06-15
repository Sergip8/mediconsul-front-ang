import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminRoutes, ElementRoutes, SettingRoutes } from './admin.routes';
import { PatientsComponent } from './views/patients/patients.component';
import { DoctorsComponent } from './views/doctors/doctors.component';
import { AppointmentsComponent } from './views/appointments/appointments.component';
import { AdminPageNotFoundComponent } from './views/admin-page-not-found/admin-page-not-found.component';
import { ConsultoriosComponent } from './views/consultorios/consultorios.component';
import { UsersComponent } from './views/users/users.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';




const routes: Routes = [
  {
    path: '',
    redirectTo: AdminRoutes.Dashboard,
    pathMatch: 'full',
  },
  {
    title: 'Dashboard',
    path: AdminRoutes.Dashboard,
    component: DashboardComponent,
  },
  {
      title: 'Registers',
      path: AdminRoutes.Registers,
      children: [
        {
          title: 'Users',
          path: ElementRoutes.Users,
          component: UsersComponent,
        },
        
        {
          title: 'Patients',
          path: ElementRoutes.Patients,
          component: PatientsComponent,
        },
        {
          title: 'Doctores',
          path: ElementRoutes.Doctors,
          component: DoctorsComponent,
        },
        {
          title: 'Citas',
          path: ElementRoutes.Citas,
          component: AppointmentsComponent,
        },
        {
          title: 'Consultorios',
          path: ElementRoutes.Consulting,
          component: ConsultoriosComponent,
        },
       
      ],
  },

  // {
  //   title: 'Events',
  //   path: AdminRoutes.Events,
  //   component: EventsComponent,
  //   children: [
  //     {
  //       path: 'testing',
  //       component: TestComponent,
  //       outlet: 'test',
  //     },
  //   ],
  // },
  // {
  //   title: 'Elements',
  //   path: AdminRoutes.Elements,
  //   children: [
      
  //     {
  //       title: 'Buttons',
  //       path: ElementRoutes.Buttons,
  //       component: ButtonsComponent,
  //     },
     
  //   ],
  // },
  // {
  //   path: AdminRoutes.Settings,
  //   children: [
  //     {
  //       title: 'Settings',
  //       path: SettingRoutes.Profile,
  //       component: ProfileComponent,
  //     },
  //     {
  //       title: 'Users',
  //       path: SettingRoutes.Users,
  //       component: UsersComponent,
  //     },
  //   ],
  // },
  { path: '**', component: AdminPageNotFoundComponent },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}

