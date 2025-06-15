import { Routes } from '@angular/router';
import { PublicComponent } from './public/public.component';
import { AdminComponent } from './admin/admin.component';
import { hasRoleGuard } from './_core/guard/has-role';
import { Role } from './public/views/auth/auth-models';

export enum AppRoutes{
  Admin = "admin",
}
export const routes: Routes = [
    {
        path: '',
        component: PublicComponent,
        loadChildren: () => import('./public/public.module').then((m) => m.PublicModule)
      },
      {
        path: AppRoutes.Admin,
        component: AdminComponent,
        canActivate : [hasRoleGuard],
        data:{
          roles: [Role.ADMIN]
        },
        loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule),
      },
];
