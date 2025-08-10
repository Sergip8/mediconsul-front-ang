import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DoctorAvailabilityInfo } from '../../../models/doctor';
import { specializationsWithSlots } from '../../utils/constans';
import { LocationService } from '../../../_core/services/location.service';

@Component({
  selector: 'app-doctor-card',
  imports: [NgFor, NgIf],
  templateUrl: './doctor-card.component.html',
  styleUrl: './doctor-card.component.css'
})
export class DoctorCardComponent implements OnInit {
  ngOnInit(): void {
    if(this.doctor?.speName)
    this.slot = specializationsWithSlots.find(spe => spe.specialization == this.doctor.speName)?.slot || 20;
  }
  constructor(private locationService: LocationService) {}

  @Input() slot = 20
  rating = Math.floor(Math.random() * 5) + 1;
  @Input() doctor!: DoctorAvailabilityInfo

  // Generate star array for displaying ratings
  get ratingStars(): number[] {
    return Array(5).fill(0).map((_, i) => i < Math.floor(this.rating) ? 1 : 
                              (i < Math.ceil(this.rating) && i >= Math.floor(this.rating)) ? 0.5 : 0);
  }

  // Format price display
  get formattedPrice(): string {
    return `${this.doctor.currency} ${(this.doctor.unitPrice*this.slot*0.1*(110-this.slot)/100).toLocaleString()}`;
  }
  selectLocation(locationId: number | null): void {
    this.locationService.selectLocation(locationId);
  }
}