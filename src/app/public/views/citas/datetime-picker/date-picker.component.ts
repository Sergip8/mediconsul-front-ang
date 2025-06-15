// medical-date-picker.component.ts
import { CommonModule, NgClass } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

export interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
}

@Component({
  selector: 'app-date-picker',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './date-picker.component.html',
 
})
export class DatePickerComponent implements OnInit {
  @Input() label: string = 'Select Date';
  @Input() placeholder: string = 'MM/DD/YYYY';
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;
  @Input() initialDate: Date | null = null;
  @Input() disabledDates: Date[] = [];
  @Input() disableWeekends: boolean = false;
  
  @Output() dateSelected = new EventEmitter<Date>();
  
  dateControl = new FormControl('');
  calendarVisible = false;
  
  currentMonth: Date = new Date();
  calendarDays: CalendarDay[] = [];
  
  weekdays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  selectedDate: Date | null = null;

  constructor() {}

  ngOnInit(): void {
    if (this.initialDate) {
      this.selectedDate = new Date(this.initialDate);
      this.currentMonth = new Date(this.initialDate);
      this.updateInputValue();
    } else {
      this.currentMonth = new Date();
    }
    this.generateCalendarDays();
  }

  generateCalendarDays(): void {
    this.calendarDays = [];
    
    // Get the first day of the month
    const firstDayOfMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
    
    // Get the last day of the month
    const lastDayOfMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);
    
    // Get the day of the week for the first day of the month (0-6, where 0 is Sunday)
    const firstDayWeekday = firstDayOfMonth.getDay();
    
    // Calculate days from previous month to display
    const daysFromPrevMonth = firstDayWeekday;
    const prevMonthLastDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 0).getDate();
    
    // Add days from previous month
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      const date = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, prevMonthLastDay - i);
      this.calendarDays.push({
        date,
        dayNumber: prevMonthLastDay - i,
        isCurrentMonth: false,
        isToday: this.isToday(date),
        isSelected: this.isSelectedDate(date),
        isDisabled: this.isDateDisabled(date)
      });
    }
    
    // Add days from current month
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const date = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), i);
      this.calendarDays.push({
        date,
        dayNumber: i,
        isCurrentMonth: true,
        isToday: this.isToday(date),
        isSelected: this.isSelectedDate(date),
        isDisabled: this.isDateDisabled(date)
      });
    }
    
    // Calculate how many days we need from next month
    const totalDaysNeeded = 42; // 6 rows * 7 days
    const daysFromNextMonth = totalDaysNeeded - this.calendarDays.length;
    
    // Add days from next month
    for (let i = 1; i <= daysFromNextMonth; i++) {
      const date = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, i);
      this.calendarDays.push({
        date,
        dayNumber: i,
        isCurrentMonth: false,
        isToday: this.isToday(date),
        isSelected: this.isSelectedDate(date),
        isDisabled: this.isDateDisabled(date)
      });
    }
  }

  prevMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1);
    this.generateCalendarDays();
  }

  nextMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1);
    this.generateCalendarDays();
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }

  isSelectedDate(date: Date): boolean {
    if (!this.selectedDate) return false;
    
    return date.getDate() === this.selectedDate.getDate() &&
      date.getMonth() === this.selectedDate.getMonth() &&
      date.getFullYear() === this.selectedDate.getFullYear();
  }

  isDateDisabled(date: Date): boolean {
    // Check if date is in disabled dates array
    const isDisabledDate = this.disabledDates.some(disabledDate => 
      date.getDate() === disabledDate.getDate() &&
      date.getMonth() === disabledDate.getMonth() &&
      date.getFullYear() === disabledDate.getFullYear()
    );
    
    // Check if date is a weekend (Saturday or Sunday)
    const isWeekend = this.disableWeekends && (date.getDay() === 0 || date.getDay() === 6);
    
    // Check if date is outside min/max range
    const isBeforeMinDate = this.minDate && date < new Date(this.minDate.setHours(0, 0, 0, 0));
    const isAfterMaxDate = this.maxDate && date > new Date(this.maxDate.setHours(23, 59, 59, 999));
    
    return (isDisabledDate || isWeekend || isBeforeMinDate || isAfterMaxDate) ?? false;
  }

  selectDate(day: CalendarDay): void {
    if (day.isDisabled) return;
    
    this.selectedDate = new Date(day.date);
    this.updateInputValue();
    this.closeCalendar();
    this.dateSelected.emit(this.selectedDate);
    
    // Regenerate calendar days to update the selected state
    this.generateCalendarDays();
  }

  updateInputValue(): void {
    if (this.selectedDate) {
      const formattedDate = this.formatDate(this.selectedDate);
      this.dateControl.setValue(formattedDate);
    }
  }

  formatDate(date: Date): string {
    // Format date as MM/DD/YYYY
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${month}/${day}/${year}`;
  }

  toggleCalendar(): void {
    this.calendarVisible = !this.calendarVisible;
    if (this.calendarVisible && this.selectedDate) {
      this.currentMonth = new Date(this.selectedDate);
      this.generateCalendarDays();
    }
  }

  closeCalendar(): void {
    this.calendarVisible = false;
  }

  goToToday(): void {
    const today = new Date();
    if (!this.isDateDisabled(today)) {
      this.selectedDate = today;
      this.currentMonth = new Date(today);
      this.generateCalendarDays();
      this.updateInputValue();
      this.dateSelected.emit(this.selectedDate);
    }
  }

  parseInputDate(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    
    // Basic validation for MM/DD/YYYY format
    const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    
    if (dateRegex.test(inputValue)) {
      const [month, day, year] = inputValue.split('/').map(part => parseInt(part, 10));
      const date = new Date(year, month - 1, day);
      
      // Check if the date is valid
      if (!isNaN(date.getTime()) && !this.isDateDisabled(date)) {
        this.selectedDate = date;
        this.currentMonth = new Date(date);
        this.generateCalendarDays();
        this.dateSelected.emit(this.selectedDate);
      }
    }
  }
}