

import { inject } from "@angular/core";

import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../../public/views/auth/auth.service";
import { Role } from "../../public/views/auth/auth-models";



export const hasRoleGuard: CanActivateFn = (route, state) => {
    const router: Router = inject(Router);
    const user = inject(AuthService)
    const userRole = user.getRole()
    const expectedRoles: Role[] = route.data['roles'];
    const hasRole: boolean = expectedRoles.every((role) => userRole.includes(role));
  
    return hasRole || router.navigate(['unauthorized']);
  };