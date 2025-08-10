import { Component, Input, OnInit, OnDestroy, AfterViewInit, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import * as L from 'leaflet';
import { LocationService } from '../../../_core/services/location.service';

export interface LocationMap {
  id: number;
  latitude: number;
  longitude: number;
  direction: string;
  neighbourhood: string;
  reference: string;
}

@Component({
  selector: 'app-map',
  standalone: true,
  template: `
    <div 
      #mapContainer
      [style.width]="width" 
      [style.height]="height"
      class="leaflet-map-container">
      <div 
        id="map" 
        #mapElement
        class="leaflet-map">
      </div>
    </div>
  `,
  styles: [`
  
    .leaflet-map-container {
      position: relative;
      overflow: hidden;
      border-radius: 8px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .leaflet-map {
      width: 100% !important;
      height: 100% !important;
      display: block !important;
      position: relative !important;
      z-index: 1;
    }

    /* Forzar estilos de Leaflet si no se cargan */
    :host ::ng-deep .leaflet-container {
      font-family: "Helvetica Neue", Arial, Helvetica, sans-serif !important;
      font-size: 12px !important;
      background: #fff !important;
    }

    :host ::ng-deep .leaflet-control-zoom {
      box-shadow: 0 1px 5px rgba(0,0,0,0.65) !important;
    }

    :host ::ng-deep .leaflet-control-zoom a {
      background-color: #fff !important;
      color: #333 !important;
      text-decoration: none !important;
    }
  `]
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  @ViewChild('mapElement', { static: false }) mapElement!: ElementRef;

  @Input() locations: LocationMap[] = [];
  @Input() width: string = '100%';
  @Input() height: string = '400px';
  @Input() zoom: number = 13;
  @Input() centerLat: number = 4.7110;
  @Input() centerLng: number = -74.0721;

  private selectedId: number | null = null;
  private map: L.Map | undefined;
  private markers: L.Marker[] = [];
  private defaultIcon?: L.Icon;
  private selectedIcon?: L.Icon;
  private subscriptions: Subscription = new Subscription();
  private mapInitialized = false;

  constructor(private locationService: LocationService) {
    this.setupIcons();
    this.setupSubscriptions();
  }

  ngOnInit() {
    
    console.log( this.locations);
  }

  ngAfterViewInit() {
    // Usar múltiples estrategias para asegurar la inicialización
    this.initializeMapWithRetry();

  }

  ngOnChanges(changes: SimpleChanges) {
      
    if (changes['locations'] && this.mapInitialized) {
      this.updateMarkers();
      this.locationService.setLocations(this.locations);
    }
    
    if ((changes['width'] || changes['height']) && this.mapInitialized) {
      this.handleResize();
    }
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
    this.subscriptions.unsubscribe();
  }

  private initializeMapWithRetry(attempts: number = 0) {
    if (attempts > 5) {
      console.error('Failed to initialize map after 5 attempts');
      return;
    }

    if (!this.mapElement?.nativeElement) {
      setTimeout(() => this.initializeMapWithRetry(attempts + 1), 100);
      return;
    }

    try {
      this.initMap();
      this.mapInitialized = true;
      this.addMarkers();
    } catch (error) {
      console.warn(`Map initialization attempt ${attempts + 1} failed:`, error);
      setTimeout(() => this.initializeMapWithRetry(attempts + 1), 200);
    }
  }

  private setupIcons() {
    // Configurar iconos con fallback
    try {
      this.defaultIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41]
      });

      this.selectedIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41]
      });
    } catch (error) {
      console.error('Error setting up icons:', error);
      // Fallback a íconos por defecto
      this.defaultIcon = new L.Icon.Default() as L.Icon;
      this.selectedIcon = new L.Icon.Default() as L.Icon;
    }
  }

  private setupSubscriptions() {
    this.subscriptions.add(
      this.locationService.selectedLocationId$.subscribe((id: number | null) => {
        this.selectedId = id;
        if (this.mapInitialized) {
          this.updateMarkerIcons();
        }
      })
    );

    this.subscriptions.add(
      this.locationService.centerOnLocation$.subscribe((id: number) => {
        this.centerOnLocationById(id);
      })
    );
  }

  private initMap() {
    const mapElement = this.mapElement.nativeElement;
    
    // Asegurar que el elemento tenga dimensiones
    if (mapElement.offsetWidth === 0 || mapElement.offsetHeight === 0) {
      throw new Error('Map container has no dimensions');
    }

    this.map = L.map(mapElement, {
      center: [this.centerLat, this.centerLng],
      zoom: this.zoom,
      zoomControl: true,
      attributionControl: true
    });

    // Múltiples proveedores de tiles como fallback
    const tileLayers = [
      {
        url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '© OpenStreetMap contributors'
      },
      {
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '© OpenStreetMap contributors'
      },
      {
        url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
        attribution: '© OpenStreetMap © CartoDB'
      }
    ];

    let tileLayerAdded = false;
    
    for (const tileConfig of tileLayers) {
      try {
        const tileLayer = L.tileLayer(tileConfig.url, {
          attribution: tileConfig.attribution,
          maxZoom: 19,
         
        });

        tileLayer.addTo(this.map);
        tileLayerAdded = true;
        break;
      } catch (error) {
        console.warn('Failed to load tile layer:', tileConfig.url, error);
      }
    }

    if (!tileLayerAdded) {
      console.error('All tile layer providers failed');
    }

    // Forzar recálculo del tamaño después de la inicialización
    setTimeout(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    }, 100);

    // También al cargar las tiles
    this.map.on('load', () => {
      setTimeout(() => {
        if (this.map) {
          this.map.invalidateSize();
        }
      }, 100);
    });
  }

  private handleResize() {
    if (this.map) {
      setTimeout(() => {
        this.map?.invalidateSize();
      }, 100);
    }
  }

  private addMarkers() {
    if (!this.map || !this.locations || !this.mapInitialized) return;

    this.clearMarkers();
    
    this.locations.forEach((location) => {
      try {
        const icon = this.selectedId === location.id ? this.selectedIcon : this.defaultIcon;
        
        const marker = L.marker([location.latitude, location.longitude], { icon })
          .addTo(this.map!);
        
        const popupContent = `
          <div class="popup-content">
            <h4><strong>ID:</strong> ${location.id}</h4>
            <p><strong>Dirección:</strong> ${location.direction}</p>
            <p><strong>Barrio:</strong> ${location.neighbourhood}</p>
            <p><strong>Referencia:</strong> ${location.reference}</p>
          </div>
        `;
        
        marker.bindPopup(popupContent);
        marker.on('click', () => {
          this.locationService.selectLocation(location.id);
        });
        
        this.markers.push(marker);
      } catch (error) {
        console.error('Error adding marker for location:', location.id, error);
      }
    });

    if (this.locations.length > 0) {
      this.fitBounds();
    }
  }

  private updateMarkers() {
    this.addMarkers();
  }

  private updateMarkerIcons() {
    if (!this.map || !this.locations || !this.mapInitialized) return;

    this.markers.forEach((marker, index) => {
      const location = this.locations[index];
      if (location) {
        const icon = this.selectedId === location.id ? this.selectedIcon : this.defaultIcon;
        if (icon) {
          marker.setIcon(icon);
        } else {
          console.error('Icon is undefined for marker:', marker);
        }
      }
    });
  }

  private clearMarkers() {
    this.markers.forEach(marker => {
      if (this.map) {
        this.map.removeLayer(marker);
      }
    });
    this.markers = [];
  }

  private fitBounds() {
    if (!this.map || this.locations.length === 0 || !this.mapInitialized) return;

    setTimeout(() => {
      if (this.locations.length === 1) {
        const location = this.locations[0];
        this.map!.setView([location.latitude, location.longitude], this.zoom);
      } else {
        try {
          const group = new L.FeatureGroup(this.markers);
          this.map!.fitBounds(group.getBounds(), { padding: [20, 20] });
        } catch (error) {
          console.warn('Error fitting bounds:', error);
        }
      }
    }, 100);
  }

  private centerOnLocationById(locationId: number) {
    const location = this.locations.find(loc => loc.id === locationId);
    if (location && this.map && this.mapInitialized) {
      this.map.setView([location.latitude, location.longitude], 16);
      
      const marker = this.markers.find((marker, index) => 
        this.locations[index].id === locationId
      );
      marker?.openPopup();
    }
  }

  // Métodos públicos
  public centerOnLocation(locationId: number) {
    this.locationService.centerOnLocation(locationId);
  }

  public setZoom(zoom: number) {
    if (this.map && this.mapInitialized) {
      this.map.setZoom(zoom);
    }
  }

  public refreshMap() {
    if (this.map && this.mapInitialized) {
      this.map.invalidateSize();
    }
  }
}