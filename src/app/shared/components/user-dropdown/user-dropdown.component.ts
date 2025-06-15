import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { Route, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../public/views/auth/auth.service';

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
  @Input() user = {
   
    email: 'jane.smith@medicalconsulting.com',
    roles: ["Patient"],
    avatar: 'assets/images/avatar.png'
  };

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
}