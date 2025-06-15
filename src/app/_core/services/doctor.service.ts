import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Patient, PatientTable, SearchParameters, UserListRequest } from '../../models/patient';
import {environment} from "../../../environments/environment";
import { Doctor, DoctorAvailabilityPayload, DoctorAvailabilityRequest } from '../../models/doctor';

const baseUrl = environment.baseUrl

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
    
    constructor(private http: HttpClient) { }
    
    getDoctorAvailability(doctorPayload: DoctorAvailabilityPayload) {
      return this.http.post<DoctorAvailabilityRequest>(baseUrl+'GetDoctorAvailability', doctorPayload )
    }
      getPagiantedDoctors(params: SearchParameters){
        return this.http.post<UserListRequest>(baseUrl+ 'GetPaginatedDoctors', params)
      }

       getDoctorInfo(doctorId: number){
          return this.http.get<Doctor>(baseUrl+'GetDoctorInfo/' +doctorId)
        }
        doctorProfileUpdate(doctor: Doctor){
          return this.http.post<Doctor>(baseUrl+'UpdateDoctorProfile', doctor)
        }
}

