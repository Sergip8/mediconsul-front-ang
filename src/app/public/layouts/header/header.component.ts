import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { PublicRoutes } from '../../public.routes';

import { NgClass, NgFor, NgIf } from '@angular/common';
import { CommonService } from '../../../_core/services/common.service';
import { UserDropdownComponent } from '../../../shared/components/user-dropdown/user-dropdown.component';
import { AuthService } from '../../views/auth/auth.service';

@Component({
  selector: 'public-header',
  standalone: true,
  imports: [RouterLink, NgIf, NgClass, NgFor, UserDropdownComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class PublicHeaderComponent implements OnInit, OnDestroy {

  readonly publicRoutes = PublicRoutes;

  emailRoles:{roles: string[], email: string, avatar: string} = {
    roles : [],
    email: "",
    avatar: 'assets/images/avatar.png'
  }

  constructor( public readonly commonService: CommonService, public authService: AuthService , private route: Router) {
   authService.roles$.subscribe(r => this.emailRoles.roles = r ?? authService.getRole())
   authService.email$.subscribe(r => this.emailRoles.email = r ?? authService.getEmail())
   console.log(this.emailRoles)
  }
  ngOnDestroy(): void {
    
  }
 
  menuItems = [
    { name: 'Home', link: '/home' },
    { name: 'Services', link: '/services' },
    { name: 'Doctors', link: '/doctors' },
    { name: 'Appointments', link: '/appointments' },
    { name: 'About Us', link: '/about' },
    { name: 'Contact', link: '/contact' }
  ];
  menuPatientItems = [
    { label: 'My Profile', icon: 'fa-user', url: '/profile' },
    { label: 'My Appointments', icon: 'fa-calendar-check', url: '/appointments' },
    { label: 'Messages', icon: 'fa-envelope', url: '/messages', badge: '3' },
    { label: 'Settings', icon: 'fa-cog', url: '/settings' },
    { label: 'Help & Support', icon: 'fa-question-circle', url: '/support' }
  ];
  menuDoctorItems = [
    { label: 'My Profile', icon: 'fa-user', url: '/profile' },
    { label: 'Calendar', icon: 'fa-calendar-check', url: '/calendar' },
    { label: 'Messages', icon: 'fa-envelope', url: '/messages', badge: '3' },
    { label: 'Settings', icon: 'fa-cog', url: '/settings' },
    { label: 'Help & Support', icon: 'fa-question-circle', url: '/support' }
  ];

  menuEmployeeItems = [
    { label: 'My Profile', icon: 'fa-user', url: '/profile' },
    { label: 'Assign Appointment', icon: 'fa-calendar-check', url: '/set-appointment' },
    { label: 'Messages', icon: 'fa-envelope', url: '/messages', badge: '3' },
    { label: 'Settings', icon: 'fa-cog', url: '/settings' },
    { label: 'Help & Support', icon: 'fa-question-circle', url: '/support' }
  ];
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  ngOnInit(): void {

   
    
  }
  logout(){
    this.authService.removeToken()
    this.authService.removeRoles()
    this.route.navigate([""])
    console.log('Logging out...');
  }

  

}
