import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-admin-page-not-found',
  templateUrl: './admin-page-not-found.component.html',
  styleUrls: ['./admin-page-not-found.component.css']
})
export class AdminPageNotFoundComponent {

  constructor(
    private router: Router,
    private location: Location
  ) {}
  
  goToDashboard(): void {
    // Navigate to the admin dashboard
    this.router.navigate(['/admin/dashboard']);
  }
  
  goBack(): void {
    // Go back to the previous page
    this.location.back();
  }
}
