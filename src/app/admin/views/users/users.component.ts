import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../../_core/services/user.service';
import { UserRequest } from '../../../public/views/auth/auth-models';
import { userColumns } from '../../../_core/schemas/user-schemas';
import { PatientTable, SearchParameters } from '../../../models/patient';
import { AlertType } from '../../../shared/components/alert/alert.type';
import { Pagination } from '../../../shared/components/pagination/pagination-model';
import { TableComponent } from '../../../shared/components/table/table.component';
import { PaginationService, PaginationState } from '../../../_core/services/pagination..service';
import { debounceTime, distinctUntilChanged, Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-users',
  imports: [TableComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  patientData!: UserRequest;
  tableData: any[] = [];
  patientColumns = userColumns;
  userId = 0;
  role = "";
  readonly alertType = AlertType;
  alert = this.alertType.Info;
  showAlert = false;
  alertMsg = "";
  params = new SearchParameters();
  loading = false;
  
  // Estado de paginación manejado por el servicio
  pagination: Pagination = {
    count: 0,
    page: 1,
    size: 10
  };
  
  // Información adicional de paginación para la UI
  paginationInfo$!: Observable<any>
  
  usersActiveChange: any[] = [];
  
  constructor(
    private userService: UserService,
    private paginationService: PaginationService
  ) {
    this.paginationInfo$ = this.paginationService.getPaginationInfo();
  }

  ngOnInit(): void {
    this.initializePagination();
    this.subscribeToStateChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Inicializa la configuración de paginación
   */
  private initializePagination(): void {
    this.paginationService.initialize({
      defaultPage: 1,
      defaultSize: 10,
      pageSizeOptions: [5, 10, 25, 50],
      urlParams: {
        page: 'page',
        size: 'size',
        sort: 'sortBy',
        direction: 'sortDir'
      }
    });
  }

  /**
   * Se suscribe a los cambios de estado de paginación
   */
  private subscribeToStateChanges(): void {
    this.paginationService.getState()
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(100), // Evitar llamadas excesivas
        distinctUntilChanged()
      )
      .subscribe(state => {
        this.updateParamsFromState(state);
        this.updatePaginationFromState(state);
        this.getPatients();
      });
  }

  /**
   * Actualiza los parámetros de búsqueda basado en el estado de paginación
   */
  private updateParamsFromState(state: PaginationState): void {
    this.params.page = state.page;
    this.params.size = state.size;
    
    if (state.sort) {
      this.params.orderCriteria = state.sort.field;
      this.params.orderDirection = state.sort.direction;
    }
  }

  /**
   * Actualiza el objeto pagination local para el componente tabla
   */
  private updatePaginationFromState(state: PaginationState): void {
    this.pagination = {
      count: state.count,
      page: state.page,
      size: state.size
    };
  }

  onFormSubmit(formData: any): void {
    console.log('Form submitted:', formData);
    // Process form data here
  }

  onFormCancel(): void {
    console.log('Form cancelled');
    // Handle form cancellation
  }

  /**
   * Obtiene los pacientes con los parámetros actuales
   */
  getPatients(): void {
    this.loading = true;
    
    this.userService.getPagiantedUsers(this.params)
      .subscribe({
        next: data => {
          this.tableData = data.data;
          // Actualizar el total en el servicio de paginación
          this.paginationService.setTotalCount(data.totalRecords);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading patients:', error);
          this.loading = false;
          this.showError('Error al cargar los datos');
        }
      });
  }

  /**
   * Maneja los clics en las filas de pacientes
   */
  onPatientClick(patient: any): void {
    console.log('Patient clicked:', patient);
  }

  /**
   * Maneja los cambios de ordenamiento
   */
  onSortChange(event: { field: any, direction: 'asc' | 'desc' }): void {
    console.log('Sort changed:', event);
    this.paginationService.setSort(event.field, event.direction);
  }

  /**
   * Maneja la eliminación de registros
   */
  onDelete(row: any): void {
    console.log('Delete:', row);
    // Implementar lógica de eliminación
    // Después de eliminar, refrescar datos
    // this.getPatients();
  }

  /**
   * Maneja la edición de registros
   */
  onEdit(row: any): void {
    console.log('Edit:', row);
    // Implementar lógica de edición
  }

  /**
   * Maneja los cambios en checkboxes
   */
  onCheckbox(row: any): void {
    this.tableData.forEach(u => {
      if (row.id === u.id) {
        if (u.is_active == 1 && !row.value) {
          this.usersActiveChange.push(row);
        }
      }
    });
    console.log(this.usersActiveChange);
  }

  /**
   * Maneja los cambios de página - MÉTODO ACTUALIZADO
   */
  gotoPage(page: number): void {
    console.log(page)
    this.paginationService.setPage(page);
  }

  /**
   * Muestra un mensaje de error
   */
  private showError(message: string): void {
    this.alert = this.alertType.Danger;
    this.alertMsg = message;
    this.showAlert = true;
    
    // Ocultar después de 5 segundos
    setTimeout(() => {
      this.showAlert = false;
    }, 5000);
  }

  /**
   * Obtiene el rango de elementos mostrados
   */
  getDisplayRange(): string {
    const state = this.paginationService.getCurrentState();
    const start = (state.page - 1) * state.size + 1;
    const end = Math.min(state.page * state.size, state.count);
    return `${start} - ${end} de ${state.count}`;
  }
}