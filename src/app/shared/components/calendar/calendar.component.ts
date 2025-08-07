import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { AppointmentDoctorDetail } from '../../../models/cita';
import { LoadingComponent } from '../loading/loading';

interface TimeSlot {
  hour: number;
  minute: number;
  formatted: string;
}

interface CalendarSlot {
  day: Date;
  time: TimeSlot;
  appointment?: AppointmentDoctorDetail;
  isHovered: boolean;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

@Component({
  selector: 'app-calendar',
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, OnChanges {
  @Input() appointments: AppointmentDoctorDetail[] = [];
  @Input() startDate: Date = new Date();
  @Input() numberOfDays: number = 7;
  @Input() slotDurationMinutes: number = 20;
  @Input() dayStartHour: number = 8; // 8 AM
  @Input() dayEndHour: number = 18; // 6 PM

  @Output() dateRangeChanged = new EventEmitter<DateRange>();

  days: Date[] = [];
  timeSlots: TimeSlot[] = [];
  calendarGrid: CalendarSlot[][] = [];
  hoveredSlot: CalendarSlot | null = null;
  currentViewStartDate: Date = new Date();
  
  constructor() {}

  ngOnInit(): void {
    this.currentViewStartDate = new Date(this.startDate);
    this.refreshCalendarView();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appointments'] && !changes['appointments'].firstChange) {
      this.populateAppointments();
    }
    if (changes['appointment_start_time'] && !changes['appointment_start_time'].firstChange) {
      this.currentViewStartDate = new Date(this.startDate);
      this.refreshCalendarView();
    }
  }

  refreshCalendarView(): void {
    this.generateDays();
    this.generateTimeSlots();
    this.generateCalendarGrid();
    this.populateAppointments();
  }

  navigatePrevious(): void {
    const newStartDate = new Date(this.currentViewStartDate);
    newStartDate.setDate(newStartDate.getDate() - this.numberOfDays);
    this.currentViewStartDate = newStartDate;
    this.refreshCalendarView();
    this.emitDateRange();
  }

  navigateNext(): void {
    const newStartDate = new Date(this.currentViewStartDate);
    newStartDate.setDate(newStartDate.getDate() + this.numberOfDays);
    this.currentViewStartDate = newStartDate;
    this.refreshCalendarView();
    this.emitDateRange();
  }

  navigateToday(): void {
    this.currentViewStartDate = new Date();
    this.refreshCalendarView();
    this.emitDateRange();
  }

  private emitDateRange(): void {
    if (this.days.length > 0) {
      const startDate = new Date(this.days[0]);
      const endDate = new Date(this.days[this.days.length - 1]);
      
      this.dateRangeChanged.emit({
        startDate,
        endDate
      });
    }
  }

  generateDays(): void {
    this.days = [];
    const currentDate = new Date(this.currentViewStartDate);
    console.log(currentDate);
    for (let i = 0; i < this.numberOfDays; i++) {
      this.days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  generateTimeSlots(): void {
    this.timeSlots = [];
    const totalMinutesInDay = (this.dayEndHour - this.dayStartHour) * 60;
    const numberOfSlots = totalMinutesInDay / this.slotDurationMinutes;
    
    for (let i = 0; i < numberOfSlots; i++) {
      const totalMinutes = this.dayStartHour * 60 + i * this.slotDurationMinutes;
      const hour = Math.floor(totalMinutes / 60);
      const minute = totalMinutes % 60;
      
      this.timeSlots.push({
        hour,
        minute,
        formatted: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      });
    }
  }

  generateCalendarGrid(): void {
    this.calendarGrid = [];
    
    this.timeSlots.forEach(timeSlot => {
      const row: CalendarSlot[] = [];
      
      this.days.forEach(day => {
        row.push({
          day: new Date(day),
          time: { ...timeSlot },
          isHovered: false
        });
      });
      
      this.calendarGrid.push(row);
    });
  }

  populateAppointments(): void {
    this.calendarGrid.forEach(row => {
      row.forEach(slot => {
        slot.appointment = undefined;
      });
    });
    console.log(this.appointments);
    if(this.appointments.length === 0) return;
    this.appointments.forEach(appointment => {
      const appointmentDate = new Date(appointment.appointment_start_time);
      const dayIndex = this.days.findIndex(day => 
        day.getFullYear() === appointmentDate.getFullYear() &&
        day.getMonth() === appointmentDate.getMonth() &&
        day.getDate() === appointmentDate.getDate()
      );
      
      if (dayIndex === -1) return; // Not in our current view
      
      const appointmentHour = appointmentDate.getHours();
      const appointmentMinute = appointmentDate.getMinutes();
      const appointmentTotalMinutes = appointmentHour * 60 + appointmentMinute;
      const startTotalMinutes = this.dayStartHour * 60;
      
      if (appointmentTotalMinutes < startTotalMinutes || 
          appointmentTotalMinutes >= this.dayEndHour * 60) return; // Outside working hours
      
      const slotIndex = Math.floor((appointmentTotalMinutes - startTotalMinutes) / this.slotDurationMinutes);
      
      if (slotIndex >= 0 && slotIndex < this.timeSlots.length) {
        this.calendarGrid[slotIndex][dayIndex].appointment = appointment;
      }
    });
    console.log(this.calendarGrid);
  }

  onSlotMouseEnter(rowIndex: number, colIndex: number): void {
    this.hoveredSlot = this.calendarGrid[rowIndex][colIndex];
    this.calendarGrid[rowIndex][colIndex].isHovered = true;
  }

  onSlotMouseLeave(rowIndex: number, colIndex: number): void {
    this.hoveredSlot = null;
    this.calendarGrid[rowIndex][colIndex].isHovered = false;
  }

  getSlotStateClass(slot: CalendarSlot): string {
    if (!slot.appointment) return '';
    
    switch (slot.appointment.status) {
      case 'Agendada': return 'bg-blue-200';
      case 'completed': return 'bg-green-200';
      case 'cancelled': return 'bg-red-200';
      case 'no-show': return 'bg-yellow-200';
      default: return '';
    }
  }

  getFormattedDate(date: Date): string {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  getDateRangeText(): string {
    const startDateFormatted = this.days[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endDateFormatted = this.days[this.days.length - 1].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${startDateFormatted} - ${endDateFormatted}`;
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }
}