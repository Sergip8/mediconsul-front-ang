import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Patient, PatientTable, SearchParameters, UserListRequest } from '../../models/patient';
import {environment} from "../../../environments/environment";
import { AlertRequest } from '../../shared/components/alert/alert.type';

const baseUrl = environment.baseUrl

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  createPatient(patient: Patient) {
    return this.http.post<any>(baseUrl+'CreatePatient', patient )
  }

  constructor(private http: HttpClient) { }

  getUserPatientInfo(userId: number){
    return this.http.get<Patient>(baseUrl+'GetUserInfo/' +userId)
  }
  getPatientInfo(patientId: number){
    return this.http.get<Patient>(baseUrl+'GetPatientInfoByPatientId/' +patientId)
  }

  getPagiantedPatients(params: SearchParameters){
    return this.http.post<UserListRequest>(baseUrl+ 'GetPaginatedPatients', params)
  }
   updatePatientData(pi: PatientTable){
      return this.http.put<AlertRequest>(baseUrl+ 'UpdatePatient', pi)
    }

}

