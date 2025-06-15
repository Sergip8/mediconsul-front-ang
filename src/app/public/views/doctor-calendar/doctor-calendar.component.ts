import { Component, OnInit } from '@angular/core';
import { CalendarComponent } from '../../../shared/components/calendar/calendar.component';
import { AppointmentService } from '../../../_core/services/citas.service';
import { AuthService } from '../auth/auth.service';
import { AppointmentDetail, AppointmentDoctorDetail } from '../../../models/cita';
import { LoadingComponent } from '../../../shared/components/loading/loading';
import { finalize } from 'rxjs';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-doctor-calendar',
  imports: [CalendarComponent, LoadingComponent, NgIf],
  templateUrl: './doctor-calendar.component.html',
  styleUrl: './doctor-calendar.component.css'
})
export class DoctorCalendarComponent implements OnInit {
  startDate = new Date('2025-03-17'); // Start with Monday
  appointmentData: AppointmentDoctorDetail[] = []
  loading = false
  constructor(private appointmentService: AppointmentService, private authService: AuthService){}
  ngOnInit(): void {
    this.getCitas()
  }

  getCitas(){
    const userId = this.authService.getUserId()
    if(userId){
      this.loading = true
      this.appointmentService.getCitas(userId).pipe(
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


  appointments = [
    {
      id: 'APT-001',
      patientName: 'John Doe',
      startTime: '2025-03-17 09:00:00',
      state: 'scheduled'
    },
    {
      id: 'APT-002',
      patientName: 'Jane Smith',
      startTime: '2025-03-17 13:30:00',
      state: 'completed'
    },
    {
      id: 'APT-003',
      patientName: 'Robert Johnson',
      startTime: '2025-03-18 10:00:00',
      state: 'cancelled'
    },
    {
      id: 'APT-004',
      patientName: 'Emily Brown',
      startTime: '2025-03-19 15:00:00',
      state: 'no-show'
    }
  ];
}
