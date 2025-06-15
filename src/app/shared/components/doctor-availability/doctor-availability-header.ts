import { NgClass, NgFor, NgIf } from "@angular/common";
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";


export interface DayInfo {
    id: number;
    date: Date;
    dayName: string;
    dayNumber: number;
    month: string;
  }


@Component({
    selector: 'app-doctor-availability-header',
    imports: [NgFor, NgClass],
    template: `
<div class="flex items-center justify-between p-4 border-b border-gray-200">
  <button 
    (click)="goToPreviousDays()" 
    [disabled]="isPreviousDisabled()"
    [ngClass]="{'text-gray-400 cursor-not-allowed': isPreviousDisabled(), 'text-blue-500 hover:bg-blue-100': !isPreviousDisabled()}"
    class="p-2 rounded-full"
    aria-label="Previous days"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  </button>
  
  <div class="flex space-x-8">
    <div *ngFor="let day of visibleDays" class="text-center">
      <div class="font-bold text-blue-600">{{ day.dayName }}</div>
      <div class="text-sm text-gray-600">{{ day.dayNumber }} {{ day.month }}</div>
    </div>
  </div>
  
  <button 
    (click)="goToNextDays()" 
    [disabled]="isNextDisabled()"
    [ngClass]="{'text-gray-400 cursor-not-allowed': isNextDisabled(), 'text-blue-500 hover:bg-blue-100': !isNextDisabled()}"
    class="p-2 rounded-full"
    aria-label="Next days"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  </button>
</div>
    `,
    styles: [`
        
    `]
})
export class DoctorAvailabilityHeader {

    daysData: DayInfo[] = [];
    visibleDays: DayInfo[] = [];
    startDayIndex = 0;
    
    @Output() selectedDaysChange = new EventEmitter<DayInfo[]>();
  
    ngOnInit(): void {
      this.daysData = this.generateDaysData();
      this.updateVisibleDays();
    }
  
    generateDaysData(): DayInfo[] {
      const days: DayInfo[] = [];
      const today = new Date();
      
      for (let i = 0; i < 5; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        days.push({
          id: i,
          date: date,
          dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
          dayNumber: date.getDate(),
          month: date.toLocaleDateString('en-US', { month: 'short' })
        });
      }
      
      return days;
    }
  
    updateVisibleDays(): void {
      this.visibleDays = this.daysData.slice(this.startDayIndex, this.startDayIndex + 3);
      this.selectedDaysChange.emit(this.visibleDays);
    }
  
    goToPreviousDays(): void {
      if (this.startDayIndex > 0) {
        this.startDayIndex--;
        this.updateVisibleDays();
      }
    }
  
    goToNextDays(): void {
      if (this.startDayIndex < this.daysData.length - 3) {
        this.startDayIndex++;
        this.updateVisibleDays();
      }
    }
  
    isPreviousDisabled(): boolean {
      return this.startDayIndex === 0;
    }
  
    isNextDisabled(): boolean {
      return this.startDayIndex >= this.daysData.length - 3;
    }
  }