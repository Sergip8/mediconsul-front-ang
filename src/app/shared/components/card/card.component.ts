import { Component, Input } from '@angular/core';
import { CardModel } from './card-model';
import { NgClass, NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-card',
  imports: [NgClass, NgFor, NgIf, RouterLink, UpperCasePipe],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {


  @Input() cardData!: CardModel;
  
  // Helper method to get the card style class based on type
  getCardClasses(): string {
    const baseClasses = 'rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300';
    
    switch(this.cardData.cardType) {
      case 'service':
        return `${baseClasses} bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500`;
      case 'doctor':
        return `${baseClasses} bg-white border border-blue-200 doctor-card`;
      case 'info':
        return `${baseClasses} bg-blue-50 border border-blue-100`;
      case 'appointment':
        return `${baseClasses} bg-gradient-to-br from-white to-blue-50 border-t-4 border-blue-400`;
      default:
        return `${baseClasses} bg-white border border-gray-200`;
    }
  }
  
  // Helper method to get button style class based on type
  getButtonClasses(): string {
    const baseClasses = 'inline-block px-4 py-2 text-white rounded-md transition duration-300 text-sm font-medium';
    
    switch(this.cardData.cardType) {
      case 'service':
        return `${baseClasses} bg-blue-600 hover:bg-blue-700`;
      case 'doctor':
        return `${baseClasses} bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800`;
      case 'info':
        return `${baseClasses} bg-blue-500 hover:bg-blue-600`;
      case 'appointment':
        return `${baseClasses} bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500`;
      default:
        return `${baseClasses} bg-blue-500 hover:bg-blue-600`;
    }
  }
  
  // Helper method to get title text color based on type
  getTitleClasses(): string {
    switch(this.cardData.cardType) {
      case 'service':
        return 'text-xl font-bold text-blue-800 mb-1';
      case 'doctor':
        return 'text-xl font-semibold text-blue-900 mb-1';
      case 'info':
        return 'text-xl font-medium text-blue-700 mb-1';
      case 'appointment':
        return 'text-xl font-semibold text-blue-800 mb-1';
      default:
        return 'text-xl font-semibold text-gray-800 mb-1';
    }
  }
}


