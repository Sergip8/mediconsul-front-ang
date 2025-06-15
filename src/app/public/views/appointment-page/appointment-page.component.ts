import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DoctorCardComponent } from '../../../shared/components/doctor-card/doctor-card.component';
import { AppointmentSelection, DoctorAvailabilityComponent } from '../../../shared/components/doctor-availability/doctor-availability.component';
import { DayInfo, DoctorAvailabilityHeader } from '../../../shared/components/doctor-availability/doctor-availability-header';
import { NgFor, NgIf } from '@angular/common';
import { DoctorService } from '../../../_core/services/doctor.service';
import { DoctorAvailabilityPayload, DoctorAvailabilityRequest } from '../../../models/doctor';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { LoadingComponent } from '../../../shared/components/loading/loading';
import { ServiceUnavailableComponent } from '../unavailable/unavailable.component';

@Component({
  selector: 'app-appointment-page',
  imports: [DoctorCardComponent, DoctorAvailabilityComponent, DoctorAvailabilityHeader, NgFor, LoadingComponent, ServiceUnavailableComponent, NgIf],
  templateUrl: './appointment-page.component.html',
  styleUrl: './appointment-page.component.css'
})
export class AppointmentPageComponent implements OnInit {
  @Input() doctorId: number = 1;
  //@Input() existingAppointments: Array<{startTime: Date, duration: number}> = [];
  loading = false
  
  @Output() appointmentSelected = new EventEmitter<AppointmentSelection>();
  doctorPayload = new DoctorAvailabilityPayload()
  visibleDays: DayInfo[] = [];
  doctor!:DoctorAvailabilityRequest

  constructor(private doctorService: DoctorService, private route: ActivatedRoute ){}
  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('speId')
    const id = Number(idParam)
    if(id){
      console.log(idParam)
      this.doctorPayload.especializacionId =  id
     
    }
    this.getDoctorsAvaiability()
  }


  getDoctorsAvaiability(){
    this.loading = true
    this.doctorService.getDoctorAvailability(this.doctorPayload).pipe( 
      finalize(()=> this.loading = false)
    ).subscribe({
      next: data =>{
        this.doctor = data
        console.log(this.doctor)
      }
    })
  }
  
  onSelectedDaysChange(days: DayInfo[]): void {
    this.visibleDays = days;
  }
  
  onSlotSelected(selection: AppointmentSelection): void {
    this.appointmentSelected.emit(selection);
  }
}
