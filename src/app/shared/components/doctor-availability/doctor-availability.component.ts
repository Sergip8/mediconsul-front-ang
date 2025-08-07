import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DayInfo } from './doctor-availability-header';
import { CitaDoctor } from '../../../models/doctor';
import { CreateCita } from '../../../models/cita';
import { AuthService } from '../../../public/views/auth/auth.service';
import { AppointmentService } from '../../../_core/services/citas.service';
import { ModalComponent } from "../modal/modal.component";
import { ButtonComponent } from "../../button/button.component";
import { Router } from '@angular/router';


interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  startTime: Date
}

export interface AppointmentSelection {
  doctorId: number;
  date: Date;
  slotId: string;
  startTime: Date;
}
@Component({
  selector: 'app-doctor-availability',
  imports: [CommonModule, ModalComponent, ButtonComponent],
  templateUrl: './doctor-availability.component.html',
  styleUrl: './doctor-availability.component.css'
})
export class DoctorAvailabilityComponent implements OnChanges  {
  @Input() doctor!: {doctorId: number, spe: number};
  @Input() visibleDays: DayInfo[] = [];
  @Input() existingAppointments: CitaDoctor[] = [];
  @Input() startHour = 8;
  @Input() endHour = 18;
  @Output() slotSelected = new EventEmitter<CreateCita>();
  
  daySlots: {[dayId: number]: TimeSlot[]} = {};
  slc = 10;
  size = 0
  btnHide = "Mostrar más"
  slot = 20
  isModalOpen = false
  modalTitle = ""
  citaSelected!: CreateCita
  constructor(private authService: AuthService, private citaService: AppointmentService, private route: Router){}
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visibleDays'] || changes['existingAppointments'] || changes['doctorId']) {
      this.generateTimeSlots();
    }
    console.log(this.existingAppointments)
  }
  
  generateTimeSlots(): void {
    this.daySlots = {};
    console.log(this.startHour, this.endHour)
    console.log(this.visibleDays)
    this.visibleDays.forEach(day => {
      const slots: TimeSlot[] = [];
      // Generate slots from 8 AM to 4 PM with 30-minute intervals
   
 
      
      for (let hour = this.startHour; hour < this.endHour; hour++) {
        for (let minute = 0; minute < 60; minute += this.slot) {
          const slotDate = new Date(day.date);
          slotDate.setHours(hour, minute, 0, 0);
          
          // Skip slots in the past
          const now = new Date();
          if (slotDate < now) {
            continue;
          }
          const timeStr = this.formatTime(hour, minute);
          const slotId = `${day.id}-${hour}-${minute}`;
          
          // Check if the slot is available (not booked)
          const isAvailable = !this.isSlotBooked(slotDate);
          
          slots.push({
            id: slotId,
            time: timeStr,
            startTime: slotDate,
            available: isAvailable
          });
        }
      }
      
      this.daySlots[day.id] = slots;
      this.size = slots.length
    });
  }
  
  isSlotBooked(slotTime: Date): boolean {
    if(this.existingAppointments && this.existingAppointments.length >0)
    // Check if the slot overlaps with any existing appointment
    return this.existingAppointments.some(appointment => {
      const date =  new Date(appointment?.appointment_start_time)
 
      const appointmentStart = new Date(date);
      const appointmentEnd = new Date(appointmentStart);
      appointmentEnd.setMinutes(appointmentEnd.getMinutes() + appointment?.slot);
      
      // Check if slot starts during an existing appointment
      return (slotTime >= appointmentStart && slotTime < appointmentEnd);
    });
    return false
  }
  
  formatTime(hour: number, minute: number): string {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    const displayMinute = minute.toString().padStart(2, '0');
    return `${displayHour}:${displayMinute} ${period}`;
  }
  
  handleSelectSlot(day: DayInfo, slot: TimeSlot): void {
    const roles = this.authService.getRole()
    if(roles)
      if(roles.includes("PATIENT")){
        const userId = this.authService.getUserId()
        const localTime = new Date(slot.startTime).toLocaleString("sv-SE", { timeZone: "America/Bogota" }).replace(" ", "T");
        this.isModalOpen = true
        if(userId){
         
          this.modalTitle = "desea agendar la cita"
          this.citaSelected = {
            slot: this.slot,
            appointmentStartTime: localTime,
            type: this.doctor.spe,
            doctorId: this.doctor.doctorId,
            userId: userId
          }
         
          //this.createAppointment(cita)

        }

      }
      else{

      }
  }
  showSlots() {
  
    if (this.slc <= 10) {
      let id = setInterval(() => {
        this.slc++;
        if (this.slc > this.size) clearInterval(id);
      }, 20);
      this.btnHide = "Mostrar menos"
      return
    }
    if (this.slc >= 10) {
      let id = setInterval(() => {
        this.slc--;
        if (this.slc == 10) clearInterval(id);
      }, 20);
      this.btnHide = "Mostrar más"
    }
    console.log(this.btnHide)
  }

  createAppointment(cita: CreateCita){
    this.citaService.createPatientCita(cita).subscribe({
      next: data => console.log(data)
    })
  }

  closeModal(): void {
    this.isModalOpen = false;
  }
  handleClickCancel(){
  this.isModalOpen = false
  }
  handleClickAccept(){
    if(this.citaSelected)
     this.slotSelected.emit(this.citaSelected)
    this.isModalOpen = false
  }

}
