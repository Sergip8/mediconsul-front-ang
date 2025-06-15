import { animate, style, transition, trigger } from "@angular/animations";
import { NgClass, NgFor, NgIf } from "@angular/common";
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";





@Component({
    selector: 'app-modal',
    imports: [NgIf],
    template: `
  <div class="modal-backdrop" *ngIf="isOpen" (click)="onClose()" @modalAnimation>
  <div class="modal-container" (click)="onModalContentClick($event)">
    <div class="modal-header">
      <h2>{{ title }}</h2>
      <button class="close-button" (click)="onClose()">×</button>
    </div>
    <div class="modal-body">
      <ng-content></ng-content>
    </div>
    <div class="modal-footer">
      <ng-content select="[modal-footer]"></ng-content>
    </div>
  </div>
</div>
    `,
    styles: [`
        .modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  width: fit-content;
  
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.modal-body {
  padding: 15px;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 15px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
}
    `],
    animations: [
        trigger('modalAnimation', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate('300ms ease-in', style({ opacity: 1 }))
            ]),
            transition(':leave', [
                animate('300ms ease-out', style({ opacity: 0 }))
            ])
        ])
    ]
})
export class ModalComponent {

    constructor() { }

    @Input() isOpen = false;
    @Input() title = 'Modal Title';
    @Output() closeModal = new EventEmitter<void>();

    onClose(): void {
      console.log("close modal")
        this.closeModal.emit();
    }

    // Prevents closing when clicking inside the modal content
    onModalContentClick(event: MouseEvent): void {
        event.stopPropagation();
    }

}