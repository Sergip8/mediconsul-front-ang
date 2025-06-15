import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Patient } from '../../models/patient';
import { Tratamiento } from '../../models/tratamiento';
import {environment} from "../../../environments/environment";

const baseUrl = environment.baseUrl

@Injectable({
  providedIn: 'root'
})
export class TratamientoService {
  createPatient(patient: Patient) {
    return this.http.post<any>(baseUrl+'CreatePatient', patient )
  }

  constructor(private http: HttpClient) { }

  getTratamientoCita(citaId: number){
    return this.http.get<Tratamiento[]>(baseUrl+'GetTratamientoCita/' +citaId)
  }
}
