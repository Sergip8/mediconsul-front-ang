import { Component, OnInit } from '@angular/core';
import { CalendarComponent, DateRange } from '../../../shared/components/calendar/calendar.component';
import { AppointmentService } from '../../../_core/services/citas.service';
import { AuthService } from '../auth/auth.service';
import { AppointmentDetail, AppointmentDoctorDetail } from '../../../models/cita';
import { LoadingComponent } from '../../../shared/components/loading/loading';
import { finalize } from 'rxjs';
import { NgIf } from '@angular/common';
import { specializationsWithSlots } from '../../../shared/utils/constans';

@Component({
  selector: 'app-doctor-calendar',
  imports: [CalendarComponent, LoadingComponent, NgIf],
  templateUrl: './doctor-calendar.component.html',
  styleUrl: './doctor-calendar.component.css'
})
export class DoctorCalendarComponent implements OnInit {
  startDate = new Date(Date.now())// Start with Monday
  appointmentData: (AppointmentDoctorDetail[] | null) = null
  loading = false
  slot = 20
  constructor(private appointmentService: AppointmentService, private authService: AuthService){}
  ngOnInit(): void {
const startDate = new Date(this.startDate);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  this.getCitas({ startDate, endDate });
  }

  getCitas(dateRange: DateRange){
    const userId = this.authService.getUserId()
    if(userId){
      this.loading = true
      this.appointmentService.getCitas(userId, dateRange).pipe(
        finalize(() => {
          this.loading = false
        })
      ).subscribe({
        next: data =>{
          this.appointmentData =data
          console.log(this.appointmentData)
        },
        error: e => console.log(e)
      })

    }
  }
getDateRange(dateRange: DateRange){
  this.getCitas(dateRange)
}

}
