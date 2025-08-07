import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

export interface PaginationState {
  page: number;
  size: number;
  count: number;
  sort?: {
    field: string;
    direction: 'asc' | 'desc';
  };
}

export interface PaginationConfig {
  defaultPage?: number;
  defaultSize?: number;
  pageSizeOptions?: number[];
  urlParams?: {
    page?: string;
    size?: string;
    sort?: string;
    direction?: string;
  };
}

// Tipo interno para la configuración completamente inicializada
interface CompletePaginationConfig {
  defaultPage: number;
  defaultSize: number;
  pageSizeOptions: number[];
  urlParams: {
    page: string;
    size: string;
    sort: string;
    direction: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  private readonly DEFAULT_CONFIG: CompletePaginationConfig = {
    defaultPage: 1,
    defaultSize: 10,
    pageSizeOptions: [5, 10, 25, 50, 100],
    urlParams: {
      page: 'page',
      size: 'size',
      sort: 'sort',
      direction: 'direction'
    }
  };

  private stateSubject = new BehaviorSubject<PaginationState>({
    page: this.DEFAULT_CONFIG.defaultPage,
    size: this.DEFAULT_CONFIG.defaultSize,
    count: 0
  });

  private config: CompletePaginationConfig = this.DEFAULT_CONFIG;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  /**
   * Inicializa el servicio de paginación con configuración personalizada
   */
  initialize(config?: PaginationConfig): void {
    // Mergear configuración con valores por defecto
    this.config = {
      defaultPage: config?.defaultPage ?? this.DEFAULT_CONFIG.defaultPage,
      defaultSize: config?.defaultSize ?? this.DEFAULT_CONFIG.defaultSize,
      pageSizeOptions: config?.pageSizeOptions ?? this.DEFAULT_CONFIG.pageSizeOptions,
      urlParams: {
        page: config?.urlParams?.page ?? this.DEFAULT_CONFIG.urlParams.page,
        size: config?.urlParams?.size ?? this.DEFAULT_CONFIG.urlParams.size,
        sort: config?.urlParams?.sort ?? this.DEFAULT_CONFIG.urlParams.sort,
        direction: config?.urlParams?.direction ?? this.DEFAULT_CONFIG.urlParams.direction
      }
    };
    
    // Inicializar el estado con los valores por defecto sin actualizar URL
    this.stateSubject.next({
      page: this.config.defaultPage,
      size: this.config.defaultSize,
      count: 0
    });
    
    this.loadStateFromUrl();
  }

  /**
   * Obtiene el estado actual de paginación como Observable
   */
  getState(): Observable<PaginationState> {
    return this.stateSubject.asObservable().pipe(
      distinctUntilChanged((prev, curr) => 
        JSON.stringify(prev) === JSON.stringify(curr)
      )
    );
  }

  /**
   * Obtiene el estado actual de paginación como valor
   */
  getCurrentState(): PaginationState {
    return this.stateSubject.value;
  }

  /**
   * Actualiza la página actual
   */
  setPage(page: number): void {
    const currentState = this.stateSubject.value;
    const maxPage = Math.ceil(currentState.count / currentState.size);
    const validPage = Math.max(1, Math.min(page, maxPage || 1));
    this.updateState({ page: validPage });
  }

  /**
   * Actualiza el tamaño de página
   */
  setPageSize(size: number): void {
    const currentState = this.stateSubject.value;
    // Recalcular la página para mantener aproximadamente la misma posición
    const currentItem = (currentState.page - 1) * currentState.size + 1;
    const newPage = Math.ceil(currentItem / size);
    
    this.updateState({ 
      size, 
      page: Math.max(1, newPage) 
    });
  }

  /**
   * Actualiza el total de registros
   */
  setTotalCount(count: number): void {
    const currentState = this.stateSubject.value;
    const maxPage = Math.ceil(count / currentState.size);
    const adjustedPage = currentState.page > maxPage ? Math.max(1, maxPage) : currentState.page;
    
    this.updateState({ 
      count,
      page: adjustedPage
    });
  }

  /**
   * Actualiza el ordenamiento
   */
  setSort(field: string, direction: 'asc' | 'desc'): void {
    this.updateState({ 
      sort: { field, direction },
      page: 1 // Resetear a la primera página al ordenar
    });
  }

  /**
   * Limpia el ordenamiento
   */
  clearSort(): void {
    const currentState = this.stateSubject.value;
    const { sort, ...stateWithoutSort } = currentState;
    this.stateSubject.next(stateWithoutSort);
    this.updateUrl();
  }

  /**
   * Resetea la paginación a los valores por defecto
   */
  reset(): void {
    this.updateState({
      page: this.config.defaultPage,
      size: this.config.defaultSize,
      count: 0,
      sort: undefined
    });
  }

  /**
   * Va a la primera página
   */
  goToFirstPage(): void {
    this.setPage(1);
  }

  /**
   * Va a la última página
   */
  goToLastPage(): void {
    const currentState = this.stateSubject.value;
    const lastPage = Math.ceil(currentState.count / currentState.size);
    this.setPage(lastPage);
  }

  /**
   * Va a la página anterior
   */
  goToPreviousPage(): void {
    const currentState = this.stateSubject.value;
    this.setPage(currentState.page - 1);
  }

  /**
   * Va a la página siguiente
   */
  goToNextPage(): void {
    const currentState = this.stateSubject.value;
    this.setPage(currentState.page + 1);
  }

  /**
   * Obtiene información útil para mostrar en la UI
   */
  getPaginationInfo(): Observable<{
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    startItem: number;
    endItem: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    isFirstPage: boolean;
    isLastPage: boolean;
  }> {
    return this.getState().pipe(
      map(state => {
        const totalPages = Math.ceil(state.count / state.size);
        const startItem = (state.page - 1) * state.size + 1;
        const endItem = Math.min(state.page * state.size, state.count);
        
        return {
          currentPage: state.page,
          totalPages,
          totalItems: state.count,
          itemsPerPage: state.size,
          startItem: state.count > 0 ? startItem : 0,
          endItem: state.count > 0 ? endItem : 0,
          hasNextPage: state.page < totalPages,
          hasPreviousPage: state.page > 1,
          isFirstPage: state.page === 1,
          isLastPage: state.page === totalPages || totalPages === 0
        };
      })
    );
  }

  /**
   * Carga el estado desde los parámetros de la URL
   */
  private loadStateFromUrl(): void {
    combineLatest([
      this.route.queryParams
    ]).subscribe(([params]) => {
      // Obtener parámetros con validación
      const pageParam = this.config.urlParams.page;
      const sizeParam = this.config.urlParams.size;
      const sortParam = this.config.urlParams.sort;
      const directionParam = this.config.urlParams.direction;

      const page = pageParam ? parseInt(params[pageParam] || this.config.defaultPage.toString()) : this.config.defaultPage;
      const size = sizeParam ? parseInt(params[sizeParam] || this.config.defaultSize.toString()) : this.config.defaultSize;
      const sortField = sortParam ? params[sortParam] : undefined;
      const sortDirection = directionParam ? params[directionParam] : undefined;

      const newState: PaginationState = {
        page: Math.max(1, isNaN(page) ? this.config.defaultPage : page),
        size: this.config.pageSizeOptions.includes(size) ? size : this.config.defaultSize,
        count: this.stateSubject.value.count
      };

      if (sortField && sortDirection && ['asc', 'desc'].includes(sortDirection)) {
        newState.sort = {
          field: sortField,
          direction: sortDirection as 'asc' | 'desc'
        };
      }

      // Solo actualizar el estado sin actualizar la URL para evitar bucles
      this.stateSubject.next(newState);
    });
  }

  /**
   * Actualiza el estado interno
   */
  private updateState(updates: Partial<PaginationState>): void {
    const currentState = this.stateSubject.value;
    const newState = { ...currentState, ...updates };
    this.stateSubject.next(newState);
    this.updateUrl();
  }

  /**
   * Actualiza la URL con los parámetros actuales
   */
  private updateUrl(): void {

    const state = this.stateSubject.value;
    const queryParams: any = {};
    // Solo agregar parámetros que no sean los valores por defecto
    if (state.page !== this.config.defaultPage) {
      queryParams[this.config.urlParams.page] = state.page;
    }
    else queryParams[this.config.urlParams.page] = this.config.defaultPage;
    
    if (state.size !== this.config.defaultSize) {
      queryParams[this.config.urlParams.size] = state.size;
    }

    if (state.sort) {
      queryParams[this.config.urlParams.sort] = state.sort.field;
      queryParams[this.config.urlParams.direction] = state.sort.direction;
    }
    console.log(queryParams)
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }
}