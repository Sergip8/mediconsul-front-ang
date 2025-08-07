import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'gradient';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ButtonShape = 'rounded' | 'square' | 'pill';

@Component({
  selector: 'app-button',
  imports: [NgClass, NgIf],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [ngClass]="buttonClasses"
      (click)="onClick($event)"
      class="inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <!-- Loading Spinner -->
      <svg 
        *ngIf="loading" 
        class="animate-spin -ml-1 mr-2 h-4 w-4 text-current" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>

      <!-- Left Icon -->
      <span *ngIf="leftIcon && !loading" [innerHTML]="leftIcon" class="mr-2"></span>

      <!-- Button Text -->
      <span *ngIf="!iconOnly">
        <ng-content></ng-content>
      </span>

      <!-- Icon Only Content -->
      <span *ngIf="iconOnly" [innerHTML]="leftIcon || rightIcon"></span>

      <!-- Right Icon -->
      <span *ngIf="rightIcon && !iconOnly && !loading" [innerHTML]="rightIcon" class="ml-2"></span>
    </button>
  `
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() shape: ButtonShape = 'rounded';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() fullWidth = false;
  @Input() iconOnly = false;
  @Input() leftIcon?: string;
  @Input() rightIcon?: string;

  @Output() buttonClick = new EventEmitter<MouseEvent>();

  get buttonClasses(): string {
    const baseClasses = [];

    // Variant classes
    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow-md',
      secondary: 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 active:bg-blue-100 shadow-sm hover:shadow-md',
      outline: 'bg-transparent text-blue-600 border border-blue-300 hover:bg-blue-50 hover:border-blue-500 active:bg-blue-100',
      ghost: 'bg-transparent text-blue-600 hover:bg-blue-50 active:bg-blue-100',
      link: 'bg-transparent text-blue-600 hover:text-blue-800 hover:underline active:text-blue-900',
      gradient: 'bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 active:from-blue-700 active:to-blue-900 shadow-lg hover:shadow-xl'
    };

    // Size classes
    const sizeClasses = {
      xs: this.iconOnly ? 'h-6 w-6 text-xs' : 'px-2 py-1 text-xs h-6',
      sm: this.iconOnly ? 'h-8 w-8 text-sm' : 'px-3 py-1.5 text-sm h-8',
      md: this.iconOnly ? 'h-10 w-10 text-base' : 'px-4 py-2 text-base h-10',
      lg: this.iconOnly ? 'h-12 w-12 text-lg' : 'px-6 py-3 text-lg h-12',
      xl: this.iconOnly ? 'h-14 w-14 text-xl' : 'px-8 py-4 text-xl h-14'
    };

    // Shape classes
    const shapeClasses = {
      rounded: 'rounded-md',
      square: 'rounded-none',
      pill: 'rounded-full'
    };

    // Add classes
    baseClasses.push(variantClasses[this.variant]);
    baseClasses.push(sizeClasses[this.size]);
    baseClasses.push(shapeClasses[this.shape]);

    // Full width
    if (this.fullWidth) {
      baseClasses.push('w-full');
    }

    // Loading state
    if (this.loading) {
      baseClasses.push('cursor-wait');
    }

    return baseClasses.join(' ');
  }

  onClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.buttonClick.emit(event);
    }
  }
}