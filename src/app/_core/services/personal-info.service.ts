import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InformacionPersonal, UserListRequest } from '../../models/patient';
import {environment} from "../../../environments/environment";
import { AlertRequest } from '../../shared/components/alert/alert.type';

const baseUrl = environment.baseUrl

@Injectable({
  providedIn: 'root'
})
export class PersonalInfoService {
  constructor(private http: HttpClient) { }


  updatePersonalInfo(pi: InformacionPersonal){
    return this.http.put<AlertRequest>(baseUrl+ 'UpdatePersonalInfo', pi)
  }
}

