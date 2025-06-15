import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { pageTransition } from '../../utils/animations';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  animations: [pageTransition],
  template: `
    <div [@pageTransition] class="flex flex-col items-center justify-center" [ngStyle]="{'width': size.w+'px', 'height': size.h+'px'}" [ngClass]="fullscreen ? 'fixed inset-0 bg-white bg-opacity-80 z-50' : ''">
      <!-- Circular Spinner -->
      <div *ngIf="type === 'circular'" class="relative">
        <div class="w-16 h-16 rounded-full border-4 border-sky-100 border-t-sky-500 animate-spin"></div>
        <div *ngIf="showText" class="mt-4 text-sky-700 font-medium">{{ loadingText }}</div>
      </div>

      <!-- Pulse Dots -->
      <div *ngIf="type === 'pulse'" class="flex space-x-2">
        <div class="w-3 h-3 bg-sky-400 rounded-full animate-pulse"></div>
        <div class="w-3 h-3 bg-sky-500 rounded-full animate-pulse delay-150"></div>
        <div class="w-3 h-3 bg-sky-600 rounded-full animate-pulse delay-300"></div>
        <div *ngIf="showText" class="ml-3 text-sky-700 font-medium">{{ loadingText }}</div>
      </div>

      <!-- Progress Bar -->
      <div *ngIf="type === 'bar'" class="w-full max-w-md">
        <div class="w-full h-2 bg-sky-100 rounded-full overflow-hidden">
          <div class="h-full bg-sky-500 rounded-full animate-progress"></div>
        </div>
        <div *ngIf="showText" class="mt-2 text-sky-700 font-medium text-center">{{ loadingText }}</div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes progress {
      0% { width: 0%; }
      50% { width: 70%; }
      100% { width: 100%; }
    }
    .animate-progress {
      animation: progress 2s ease-in-out infinite;
    }
    .delay-150 {
      animation-delay: 150ms;
    }
    .delay-300 {
      animation-delay: 300ms;
    }
  `]
})
export class LoadingComponent {
  @Input() type: 'circular' | 'pulse' | 'bar' = 'circular';
  @Input() loadingText: string = 'Loading...';
  @Input() showText: boolean = true;
  @Input() fullscreen: boolean = false;
  @Input() size: {w: number, h: number} = {w: 400, h:600}
}