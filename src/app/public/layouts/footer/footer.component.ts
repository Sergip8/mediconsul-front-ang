import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'public-footer',
  imports: [RouterLink,NgFor],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class PublicFooterComponent {
  currentYear: number = new Date().getFullYear();
  
  // Contact information
  contactInfo = {
    phone: '+1 (555) 123-4567',
    email: 'info@medicalconsulting.com',
    address: '123 Health Avenue, Medical District, MD 12345'
  };
  
  // Quick links
  quickLinks = [
    { title: 'Our Services', url: '/services' },
    { title: 'Find a Doctor', url: '/doctors' },
    { title: 'Patient Resources', url: '/resources' },
    { title: 'Appointments', url: '/appointments' },
    { title: 'Insurance Information', url: '/insurance' }
  ];
  
  // Social media links
  socialLinks = [
    { name: 'Facebook', url: 'https://facebook.com', icon: 'fa-facebook-f' },
    { name: 'Twitter', url: 'https://twitter.com', icon: 'fa-twitter' },
    { name: 'LinkedIn', url: 'https://linkedin.com', icon: 'fa-linkedin-in' },
    { name: 'Instagram', url: 'https://instagram.com', icon: 'fa-instagram' }
  ];
}