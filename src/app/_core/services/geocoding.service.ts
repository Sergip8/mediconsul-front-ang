import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NominatimResponse } from '../../public/views/auth/doctor-signup/doctor-signup.component';



@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  private apiUrl = 'https://nominatim.openstreetmap.org/search';

  constructor(private http: HttpClient) {}

  /**
   * Busca una dirección en Nominatim y devuelve coordenadas
   * @param query Dirección o lugar a buscar
   */
  searchLocation(query: string): Observable<NominatimResponse[]> {
    let params = new HttpParams()
      .set('q', query)
      .set('format', 'json')
      .set('countrycodes', 'CO')
      .set('limit', '5')
      .set('addressdetails', '1');


    return this.http.get<NominatimResponse[]>(this.apiUrl, { params });
  }
}