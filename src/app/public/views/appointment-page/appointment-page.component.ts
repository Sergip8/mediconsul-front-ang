import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DoctorCardComponent } from '../../../shared/components/doctor-card/doctor-card.component';
import { AppointmentSelection, DoctorAvailabilityComponent } from '../../../shared/components/doctor-availability/doctor-availability.component';
import { DayInfo, DoctorAvailabilityHeader } from '../../../shared/components/doctor-availability/doctor-availability-header';
import { NgFor, NgIf } from '@angular/common';
import { DoctorService } from '../../../_core/services/doctor.service';
import { DoctorAvailabilityPayload, DoctorAvailabilityRequest, DoctorLocations } from '../../../models/doctor';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { LoadingComponent } from '../../../shared/components/loading/loading';
import { ServiceUnavailableComponent } from '../unavailable/unavailable.component';
import { CreateCita } from '../../../models/cita';
import { AuthService } from '../auth/auth.service';
import { CommonService } from '../../../_core/services/common.service';
import { AlertType } from '../../../shared/components/alert/alert.type';
import { LocationMap, MapComponent } from "../../../shared/components/map/map.component";
import { TimeSlotsLoadingComponent } from "../../../shared/components/loading/loading-time-slots";

@Component({
  selector: 'app-appointment-page',
  standalone: true,
  imports: [DoctorCardComponent, DoctorAvailabilityComponent, DoctorAvailabilityHeader, NgFor, LoadingComponent, ServiceUnavailableComponent, NgIf, MapComponent, TimeSlotsLoadingComponent],
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
  locations: LocationMap[] = [];
  expectedDaysCount = 3;
  expectedSlotsPerDay = 8;

  constructor(private doctorService: DoctorService, 
    private route: ActivatedRoute, private router: Router, private authService: AuthService, private commonService: CommonService){}
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
     this.showLoading(3, 8);
    this.doctorService.getDoctorAvailability(this.doctorPayload).pipe( 
      finalize(()=> this.hideLoading())
    ).subscribe({
      next: data =>{
        this.doctor = data
        this.locations = this.doctor.doctores.flatMap(d => d.locations.map(location => ({...location, id: d.id})));
        console.log(this.doctor)
      }
    })
  }
  
  onSelectedDaysChange(days: DayInfo[]): void {
    this.visibleDays = days;
  }
  
  onSlotSelected(selection: CreateCita): void {
    selection.doctor = this.doctor.doctores.find(d => d.id === selection.doctorId)
    console.log(selection)
    if(selection.doctor){

      if (this.authService.getUserId()) {
        this.router.navigate(["payment"], { state: { cita: selection} });
      } else {
        this.commonService.updateAlert({
          message: 'Debes iniciar sesión para solicitar una cita',
          alertType: AlertType.Danger,
          show: true
        });
        this.router.navigate(['/signin']);
      }
    }
  }
   showLoading(daysCount: number = 1, slotsCount: number = 6): void {
    this.loading = true;
    this.expectedDaysCount = daysCount;
    this.expectedSlotsPerDay = slotsCount;
  }
    hideLoading(): void {
    this.loading = false;
  }
}
