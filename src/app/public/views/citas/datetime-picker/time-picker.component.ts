// time-picker.component.ts
import { CommonModule } from '@angular/common';
import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-time-picker',
   template: `
   <!-- time-picker.component.html -->
<div class="relative">
  <div 
    (click)="toggleDropdown()" 
    class="flex items-center cursor-pointer border border-gray-100 rounded-md p-2 bg-white focus:outline-none focus:ring-2 focus:ring-sky-300"
    [ngClass]="{'cursor-not-allowed opacity-50': disabled}"
  >
    <span class="text-gray-400 block text-sm font-medium mb-1">{{ padZero(selectedHour) }}:{{ padZero(selectedMinute) }} {{ selectedAmPm }}</span>
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 text-sky-500" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" transform="rotate(45 10 10)" />
    </svg>
  </div>

  <!-- Dropdown -->
  <div *ngIf="isOpen" class="absolute mt-[2px] w-64 bg-white rounded-md shadow-lg z-10 border border-sky-100 block text-sm font-medium text-gray-700 mb-1">
    <div class="p-2">
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-sm font-medium text-sky-700">Select Time</h3>
        <button 
          (click)="toggleDropdown()" 
          class="text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="flex space-x-2 h-52">
          <!-- Hours -->
         
              <div class="w-1/3 border rounded-md ">
                <div class="h-48 overflow-y-auto py-1 scrollbar">
                  <div 
                    *ngFor="let hour of hours" 
                    (click)="selectHour(hour)" 
                    class="px-2 py-1 text-center hover:bg-sky-100 cursor-pointer transition-colors"
                    [ngClass]="{'bg-blue-600 font-medium  text-gray-100': selectedHour === hour}"
                  >
                    {{ padZero(hour) }}
                  </div>
                </div>
              </div>

        <!-- Minutes -->
        <div class="w-1/3 border rounded-md ">
          <div class="h-48 overflow-y-auto py-1 scrollbar">
            <div 
              *ngFor="let minute of minutes" 
              (click)="selectMinute(minute)" 
              class="px-2 py-1 text-center hover:bg-sky-100 cursor-pointer transition-colors"
              [ngClass]="{'bg-blue-600 font-medium  text-gray-100': selectedMinute === minute}"
            >
              {{ padZero(minute) }}
            </div>
          </div>
        </div>
        
        <!-- AM/PM -->
        <div class="w-1/3 border rounded-md ">
          <div class="h-48 flex flex-col justify-start py-1">
            <div 
              *ngFor="let period of ampm" 
              (click)="selectAmPm(period)" 
              class="px-2 py-1 text-center hover:bg-sky-100 cursor-pointer transition-colors"
              [ngClass]="{'bg-blue-600 font-medium  text-gray-100': selectedAmPm === period}"
            >
              {{ period }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="mt-3 flex justify-end">
        <button 
          (click)="toggleDropdown()" 
          class="px-4 py-2 bg-sky-200 text-gray-500 rounded-md hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-300 transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  </div>
</div>
   `,
 imports:[CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimePickerComponent),
      multi: true
    }
  ]
})
export class TimePickerComponent implements ControlValueAccessor, OnInit {
  hours: number[] = [];
  minutes: number[] = [0, 20, 40];
  ampm: string[] = ['AM', 'PM'];
  
  selectedHour: number = 12;
  selectedMinute: number = 0;
  selectedAmPm: string = 'AM';
  
  isOpen: boolean = false;
  
  disabled: boolean = false;
  
  onChange: any = () => {};
  onTouched: any = () => {};
  
  constructor() { }
  
  ngOnInit(): void {
   
    for (let i = 1; i <= 12; i++) {
      this.hours.push(i);
    }
    
    // Generate minutes (0-59)
  
  }
  
  toggleDropdown(): void {
    if (!this.disabled) {
      this.isOpen = !this.isOpen;
      if (!this.isOpen) {
        this.onTouched();
      }
    }
  }
  
  selectHour(hour: number): void {
    this.selectedHour = hour;
    this.updateValue();
  }
  
  selectMinute(minute: number): void {
    this.selectedMinute = minute;
    this.updateValue();
  }
  
  selectAmPm(value: string): void {
    this.selectedAmPm = value;
    this.updateValue();
  }
  
  updateValue(): void {
    const timeString = `${this.padZero(this.selectedHour)}:${this.padZero(this.selectedMinute)} ${this.selectedAmPm}`;
    this.onChange(timeString);
  }
  
  padZero(num: number): string {
    return num < 10 ? `0${num}` : num.toString();
  }
  
  // ControlValueAccessor interface methods
  writeValue(value: string): void {
    if (value) {
      const timeParts = value.split(' ');
      const timeValues = timeParts[0].split(':');
      this.selectedHour = parseInt(timeValues[0], 10);
      this.selectedMinute = parseInt(timeValues[1], 10);
      this.selectedAmPm = timeParts[1] || 'AM';
    }
  }
  
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}