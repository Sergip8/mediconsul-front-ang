import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InformacionMedica} from '../../models/patient';
import {environment} from "../../../environments/environment";
import { AlertRequest } from '../../shared/components/alert/alert.type';

const baseUrl = environment.baseUrl

@Injectable({
  providedIn: 'root'
})
export class MedicalInfoService {
  constructor(private http: HttpClient) { }


  updateMedicalInfo(im: InformacionMedica){
    return this.http.put<AlertRequest>(baseUrl+ 'UpdateMedicalInfo', im)
  }
}

