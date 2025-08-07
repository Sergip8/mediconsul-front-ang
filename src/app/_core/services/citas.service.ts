import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Patient, SearchParameters } from '../../models/patient';
import { AppointmentDetail, CitasTable, CreateCita } from '../../models/cita';
import {environment} from "../../../environments/environment";
import { AppointmentDoctorResponse } from '../../models/appointment-doctor-response';
import { AppointmentAvaiable } from '../../models/appointment-avaiable';
import { DoctorAvailabilityInfo } from '../../models/doctor';
import { PatientAppointment } from '../../models/appointment-patient-request';
import { DateRange } from '../../shared/components/calendar/calendar.component';

const baseUrl = environment.baseUrl

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  createPatientCita(cita: CreateCita) {
    return this.http.post<any>(baseUrl+'CreatePatientCita', cita )
  }

  constructor(private http: HttpClient) { }

  getCitas(userId: number, dateRange?: DateRange) {
    // Formatear las fechas en formato ISO o el formato que espere tu API
    const startDateStr = dateRange?.startDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const endDateStr = dateRange?.endDate.toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Crear HttpParams para los query parameters
    const params = new HttpParams()
      .set('startDate', startDateStr || '')
      .set('endDate', endDateStr || '');
    
    return this.http.get<any[]>(baseUrl + 'GetCitasByUserId/' + userId, { params });
  }
    getPagiantedAppointments(params: SearchParameters){
          return this.http.post<any>(baseUrl+ 'GetPaginatedAppointments', params)
        }

        getAppointmentResponse(doctorResponse: AppointmentDoctorResponse){
          return this.http.post<DoctorAvailabilityInfo[]>(baseUrl +'/doctor', doctorResponse)
        }

}
