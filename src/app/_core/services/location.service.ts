import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { LocationMap } from '../../shared/components/map/map.component'; // Ajusta la ruta según tu estructura

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  // BehaviorSubject para mantener el último valor del ID seleccionado
  private selectedLocationIdSubject = new BehaviorSubject<number | null>(null);
  
  // Subject para eventos de selección (sin mantener el último valor)
  private locationSelectedSubject = new Subject<number | null>();
  
  // Subject para eventos de centrado en el mapa
  private centerOnLocationSubject = new Subject<number>();
  
  // BehaviorSubject para la lista de localizaciones (opcional)
  private locationsSubject = new BehaviorSubject<LocationMap[]>([]);

  constructor() {}

  // OBSERVABLES PÚBLICOS
  
  /**
   * Observable que emite el ID de la localización seleccionada
   * Mantiene el último valor (BehaviorSubject)
   */
  get selectedLocationId$(): Observable<number | null> {
    return this.selectedLocationIdSubject.asObservable();
  }

  /**
   * Observable que emite eventos de selección
   * No mantiene el último valor (Subject)
   */
  get locationSelected$(): Observable<number | null> {
    return this.locationSelectedSubject.asObservable();
  }

  /**
   * Observable para eventos de centrado en el mapa
   */
  get centerOnLocation$(): Observable<number> {
    return this.centerOnLocationSubject.asObservable();
  }

  /**
   * Observable para la lista de localizaciones
   */
  get locations$(): Observable<LocationMap[]> {
    return this.locationsSubject.asObservable();
  }

  // MÉTODOS PÚBLICOS

  /**
   * Selecciona una localización por ID
   * @param id ID de la localización o null para deseleccionar
   */
  selectLocation(id: number | null): void {
    this.selectedLocationIdSubject.next(id);
    this.locationSelectedSubject.next(id);
  }

  /**
   * Obtiene el ID de la localización actualmente seleccionada
   */
  getCurrentSelectedId(): number | null {
    return this.selectedLocationIdSubject.getValue();
  }

  /**
   * Solicita centrar el mapa en una localización específica
   * @param id ID de la localización
   */
  centerOnLocation(id: number): void {
    this.centerOnLocationSubject.next(id);
  }

  /**
   * Deselecciona la localización actual
   */
  clearSelection(): void {
    this.selectLocation(null);
  }

  /**
   * Alterna la selección de una localización
   * Si ya está seleccionada, la deselecciona. Si no, la selecciona.
   * @param id ID de la localización
   */
  toggleSelection(id: number): void {
    const currentId = this.getCurrentSelectedId();
    this.selectLocation(currentId === id ? null : id);
  }

  /**
   * Actualiza la lista de localizaciones
   * @param locations Nueva lista de localizaciones
   */
  setLocations(locations: LocationMap[]): void {
    this.locationsSubject.next(locations);
  }

  /**
   * Obtiene la lista actual de localizaciones
   */
  getCurrentLocations(): LocationMap[] {
    return this.locationsSubject.getValue();
  }

  /**
   * Busca una localización por ID
   * @param id ID de la localización
   * @returns Localización encontrada o undefined
   */
  getLocationById(id: number): LocationMap | undefined {
    return this.getCurrentLocations().find(location => location.id === id);
  }

  /**
   * Verifica si existe una localización con el ID dado
   * @param id ID a verificar
   * @returns true si existe, false si no
   */
  locationExists(id: number): boolean {
    return this.getCurrentLocations().some(location => location.id === id);
  }

  // MÉTODO PARA CLEANUP (opcional, para casos especiales)
  
  /**
   * Limpia todos los subjects (usar solo si es necesario)
   * Útil en casos de logout o cambio de contexto completo
   */
  reset(): void {
    this.selectedLocationIdSubject.next(null);
    this.locationsSubject.next([]);
  }
}