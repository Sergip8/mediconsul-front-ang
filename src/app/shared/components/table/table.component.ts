import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../pagination/pagination';
import { Pagination } from '../pagination/pagination-model';

export interface TableColumn {
  header: string;
  field: string;
  sortable?: boolean;
  type?: 'text' | 'date' | 'number' | 'status' | "bool" | "action";
  width?: string;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, PaginationComponent],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() loading: boolean = false;
  @Input() pagination!: Pagination;
  @Input() pageSize: number = 10;
  @Input() title: string = '';
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() onCheckbox  = new EventEmitter<any>();
  
  @Output() rowClick = new EventEmitter<any>();
  @Output() sortChange = new EventEmitter<{field: string, direction: 'asc' | 'desc'}>();
  
  currentPage: number = 1;
  sortField: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  
  constructor(){

  }
  
  onSort(column: TableColumn): void {
    if (!column.sortable) return;
    
    if (this.sortField === column.field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = column.field;
      this.sortDirection = 'asc';
    }
    
    this.sortChange.emit({field: column.field, direction: this.sortDirection});
  }
  
  onRowClick(row: any): void {
    this.rowClick.emit(row);
  }
  
  getSortIcon(column: TableColumn): string {
    if (!column.sortable) return '';
    if (this.sortField !== column.field) return 'sort';
    return this.sortDirection === 'asc' ? 'sort-up' : 'sort-down';
  }
  
  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'agendada':
      case 'completed':
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}