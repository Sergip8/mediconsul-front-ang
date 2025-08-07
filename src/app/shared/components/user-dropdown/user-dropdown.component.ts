import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { Route, Router, RouterLink } from '@angular/router';
import { AuthService, UserMenu } from '../../../public/views/auth/auth.service';

export interface MenuItems{
  label: string
  icon: string
  url: string
  badge?: string
}

@Component({
  selector: 'app-user-dropdown',
  imports: [RouterLink, NgIf, NgClass, NgFor],
  templateUrl: './user-dropdown.component.html',
  styleUrls: ['./user-dropdown.component.css']
})
export class UserDropdownComponent implements OnInit {
  isOpen: boolean = false;
  @Input() menuItems: MenuItems[] = []
  @Output() logout = new EventEmitter()
  @Input() user: UserMenu = {
   
    email: 'jane.smith@medicalconsulting.com',
    roles: ["Patient"],
    avatar: 'assets/images/avatar.png'
  };
   imageLoadError = false;

  constructor(private autService: AuthService, private route: Router) { }

  ngOnInit(): void {
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const element = event.target as HTMLElement;
    if (!element.closest('#user-dropdown-container') && this.isOpen) {
      this.isOpen = false;
    }
  }

  onLogout(): void {
    this.logout.emit()
  }
   onImageError(event: any): void {
    if (!this.imageLoadError) {
      this.imageLoadError = true;
      event.target.src = 'assets/images/default-avatar.png';
      console.warn('Avatar image not found, using default');
    } else {
      // Si el default también falla, usar placeholder o remover src
      event.target.style.display = 'none';
      // O usar una imagen base64 pequeña como último recurso
    }
  }

  onImageLoad(): void {
    this.imageLoadError = false; // Reset cuando carga correctamente
  }
}