import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Patient, PatientTable, SearchParameters, UserListRequest } from '../../models/patient';
import {environment} from "../../../environments/environment";

const baseUrl = environment.baseUrl

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }


  getPagiantedPatients(params: SearchParameters){
    return this.http.post<UserListRequest>(baseUrl+ 'GetPaginatedUsers', params)
  }
}

