import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Patient, SearchParameters } from '../../models/patient';
import { AppointmentDetail, CitasTable, CreateCita } from '../../models/cita';
import {environment} from "../../../environments/environment";
import { AppointmentDoctorResponse } from '../../models/appointment-doctor-response';
import { AppointmentAvaiable } from '../../models/appointment-avaiable';
import { DoctorAvailabilityInfo } from '../../models/doctor';

const baseUrl = environment.baseUrl

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  createPatientCita(cita: CreateCita) {
    return this.http.post<any>(baseUrl+'CreatePatientCita', cita )
  }

  constructor(private http: HttpClient) { }

  getCitas(userId: number){
    return this.http.get<any[]>(baseUrl+'GetCitasByUserId/' +userId)
  }
    getPagiantedAppointments(params: SearchParameters){
          return this.http.post<any>(baseUrl+ 'GetPaginatedAppointments', params)
        }

        getAppointmentResponse(doctorResponse: AppointmentDoctorResponse){
          return this.http.post<DoctorAvailabilityInfo[]>(baseUrl +'/doctor', doctorResponse)
        }

}
