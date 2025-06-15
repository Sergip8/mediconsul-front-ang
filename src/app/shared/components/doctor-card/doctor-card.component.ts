import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DoctorAvailabilityInfo } from '../../../models/doctor';

export interface DoctorInfo {
  id: number;
  name: string;
  specialty: string;
  qualifications: string[];
  experience: number;
  rating: number;
  totalReviews: number;
  consultationFee: number;
  location: string;
  profileImage: string;
  languages: string[];
}

@Component({
  selector: 'app-doctor-card',
  imports: [NgFor, NgIf],
  templateUrl: './doctor-card.component.html',
  styleUrl: './doctor-card.component.css'
})
export class DoctorCardComponent {

  rating = Math.floor(Math.random() * 5) + 1;
  @Input() doctor!: DoctorAvailabilityInfo

  // Generate star array for displaying ratings
  get ratingStars(): number[] {
    return Array(5).fill(0).map((_, i) => i < Math.floor(this.rating) ? 1 : 
                              (i < Math.ceil(this.rating) && i >= Math.floor(this.rating)) ? 0.5 : 0);
  }
}
