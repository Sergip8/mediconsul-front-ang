import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Patient, PatientTable, SearchParameters, PaginatedRequest } from '../../models/patient';
import {environment} from "../../../environments/environment";
import { Doctor, DoctorAvailabilityPayload, DoctorAvailabilityRequest, DoctorRegisterForm, LocationData } from '../../models/doctor';
import { Observable, tap } from 'rxjs';
import { DoctorRegister } from '../../public/views/auth/auth-models';

const baseUrl = environment.baseUrl

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
    
    constructor(private http: HttpClient) { }
    
    getDoctorAvailability(doctorPayload: DoctorAvailabilityPayload) {
      return this.http.post<DoctorAvailabilityRequest>(baseUrl+'GetDoctorAvailability', doctorPayload )
    }
      getPaginatedDoctors(params: SearchParameters){
        return this.http.post<PaginatedRequest<Doctor>>(baseUrl+ 'GetPaginatedDoctors', params)
      }

       getDoctorInfo(doctorId: number){
          return this.http.get<Doctor>(baseUrl+'GetDoctorInfo/' +doctorId)
        }
        doctorProfileUpdate(doctor: Doctor){
          return this.http.post<Doctor>(baseUrl+'UpdateDoctorProfile', doctor)
        }
    updateDoctorData(doctor: Doctor){
          return this.http.post<Doctor>(baseUrl+'UpdateDoctorProfile', doctor)
        }
        createDoctor(doctor: Doctor) {
          return this.http.post<any>(baseUrl+'CreateDoctor', doctor )
        }


  registerDoctor(formData: DoctorRegister): Observable<any> {
    const url = `${baseUrl}RegisterDoctor`;
    return this.http.post(url, formData);
  }
  

  
}


