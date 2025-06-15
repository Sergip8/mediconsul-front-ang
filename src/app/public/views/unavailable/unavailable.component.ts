import { Component, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-service-unavailable',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center p-8 bg-sky-50 border border-sky-200 rounded-lg shadow-sm">
      <div class="text-sky-500 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      
      <h2 class="text-xl font-semibold text-sky-800 mb-2">{{ title }}</h2>
      
      <p class="text-sky-600 text-center mb-4">{{ message }}</p>
      
      <button 
        *ngIf="showRetryButton"
        (click)="onRetry.emit()" 
        class="px-4 py-2 bg-sky-100 hover:bg-sky-200 text-sky-700 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
      >
        {{ retryButtonText }}
      </button>
    </div>
  `,
  styles: []
})
export class ServiceUnavailableComponent {
  @Input() title: string = 'No hay resultados';
  @Input() message: string = 'No hemos encontrado lo que buscas';
  @Input() showRetryButton: boolean = false;
  @Input() retryButtonText: string = 'Retry';
  @Input() onRetry = new EventEmitter<void>();
}