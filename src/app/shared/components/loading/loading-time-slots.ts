// time-slots-loading.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-time-slots-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col justify-center">
      <!-- Slot para contenido superior (ng-content del componente padre) -->
      <div class="mb-4" *ngIf="showTopContent">
        <div class="h-8 bg-gray-200 rounded animate-pulse w-48 mx-auto"></div>
      </div>
      
      <div class="p-4 gap-4" [ngClass]="{'grid grid-cols-3': daysCount > 1}">
        <!-- Skeleton para cada día -->
        <div *ngFor="let i of getDaysArray()" class="flex flex-col">
          <!-- Header del día - skeleton -->
          <div class="mb-2 pb-2 border-b border-gray-200">
            <div class="h-5 bg-gray-200 rounded animate-pulse mx-auto" 
                 [ngClass]="getHeaderWidthClass(i)"></div>
          </div>
          
          <!-- Grid de slots - skeleton -->
          <div class="grid grid-cols-2 gap-2">
            <!-- Skeleton slots -->
            <div *ngFor="let j of getSlotsArray()" 
                 class="py-2 px-3 text-sm rounded-md animate-pulse"
                 [ngClass]="getSlotClass(j)">
              <div class="h-4 bg-gray-200 rounded mx-auto" 
                   [ngClass]="getSlotTimeWidthClass(j)"></div>
            </div>
            
            <!-- Skeleton para "No available slots" si corresponde -->
            <div *ngIf="showEmptyMessage && i === 0" 
                 class="col-span-2 text-center py-4">
              <div class="h-4 bg-gray-200 rounded animate-pulse w-32 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Skeleton para el botón de mostrar/ocultar -->
      <div class="flex justify-center mt-2" *ngIf="showToggleButton">
        <div class="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  `,
  styles: [`
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: .5;
      }
    }
  `]
})
export class TimeSlotsLoadingComponent {
  @Input() daysCount: number = 1;
  @Input() slotsPerDay: number = 6;
  @Input() showTopContent: boolean = false;
  @Input() showToggleButton: boolean = true;
  @Input() showEmptyMessage: boolean = false;
  @Input() animationDuration: number = 2; // segundos
  @Input() pulseIntensity: 'light' | 'normal' | 'strong' = 'normal';

  getDaysArray(): number[] {
    return Array.from({ length: this.daysCount }, (_, i) => i);
  }

  getSlotsArray(): number[] {
    return Array.from({ length: this.slotsPerDay }, (_, i) => i);
  }

  getHeaderWidthClass(dayIndex: number): string {
    // Variación en el ancho de los headers para más realismo
    const widths = ['w-24', 'w-32', 'w-28', 'w-36'];
    return widths[dayIndex % widths.length];
  }

  getSlotClass(slotIndex: number): string {
    // Variación en el estilo de los slots para simular disponibles/no disponibles
    const isAvailable = slotIndex % 4 !== 0; // Simula que 1 de cada 4 no está disponible
    return isAvailable ? 'bg-blue-50' : 'bg-gray-100';
  }

  getSlotTimeWidthClass(slotIndex: number): string {
    // Variación en el ancho del tiempo para más realismo
    const widths = ['w-10', 'w-12', 'w-14'];
    return widths[slotIndex % widths.length];
  }
}