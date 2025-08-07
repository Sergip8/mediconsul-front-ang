import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

export type ModalPosition = 'center' | 'top-center';
export type ModalAnimation = 'fade' | 'slide-down';

@Component({
  selector: 'app-modal',
  imports: [NgIf, NgClass],
  template: `
    <div 
      class="fixed inset-0 bg-black bg-opacity-50 z-50 flex"
      [ngClass]="{
        'items-center justify-center': position === 'center',
        'items-start justify-center pt-20': position === 'top-center'
      }"
      *ngIf="isOpen" 
      (click)="onClose()" 
      [@backdropAnimation]
    >
      <div 
        class="bg-white rounded-lg shadow-xl max-h-[90vh] flex flex-col relative"
        [ngClass]="{
          'w-fit': !fullWidth,
          'w-full max-w-lg mx-4': fullWidth,
          'min-w-96': !fullWidth
        }"
        (click)="onModalContentClick($event)"
        [@modalContentAnimation]="animation"
      >
        <!-- Header -->
        <div class="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900 m-0">{{ title }}</h2>
          <button 
            class="text-gray-400 hover:text-gray-600 transition-colors duration-200 bg-transparent border-none text-2xl cursor-pointer p-0 leading-none"
            (click)="onClose()"
            aria-label="Cerrar modal"
          >
            ×
          </button>
        </div>

        <!-- Body -->
        <div class="px-6 py-4 overflow-y-auto flex-1">
          <ng-content></ng-content>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-200 flex justify-end">
          <ng-content select="[modal-footer]"></ng-content>
        </div>
      </div>
    </div>
  `,
  animations: [
    // Animación del backdrop
    trigger('backdropAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ]),
    
    // Animaciones del contenido del modal
    trigger('modalContentAnimation', [
      // Animación fade
      transition('* => fade', [
        style({ 
          opacity: 0, 
          transform: 'translateY(0) scale(0.9)'
        }),
        animate('300ms cubic-bezier(0.34, 1.56, 0.64, 1)', 
          style({ 
            opacity: 1, 
            transform: 'translateY(0) scale(1)'
          })
        )
      ]),
      
      // Animación slide-down
      transition('* => slide-down', [
        style({ 
          opacity: 0, 
          transform: 'translateY(-50px) scale(1)'
        }),
        animate('300ms cubic-bezier(0.34, 1.56, 0.64, 1)', 
          style({ 
            opacity: 1, 
            transform: 'translateY(0) scale(1)'
          })
        )
      ]),
      
      // Salida para ambas animaciones
      transition('fade => void', [
        animate('200ms ease-in', 
          style({ 
            opacity: 0, 
            transform: 'translateY(0) scale(0.9)'
          })
        )
      ]),
      
      transition('slide-down => void', [
        animate('200ms ease-in', 
          style({ 
            opacity: 0, 
            transform: 'translateY(-30px) scale(1)'
          })
        )
      ])
    ])
  ]
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = 'Modal Title';
  @Input() position: ModalPosition = 'top-center';
  @Input() animation: ModalAnimation = 'fade';
  @Input() fullWidth = false;
  @Input() closeOnBackdropClick = true;
  @Input() showCloseButton = true;
  
  @Output() closeModal = new EventEmitter<void>();

  constructor() { }

  onClose(): void {
    console.log("close modal");
    this.closeModal.emit();
  }

  // Previene el cierre cuando se hace clic dentro del contenido del modal
  onModalContentClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  // Método para cerrar con backdrop click (opcional)
  onBackdropClick(): void {
    if (this.closeOnBackdropClick) {
      this.onClose();
    }
  }
}