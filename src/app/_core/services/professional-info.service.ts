import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { InformacionPersonal } from "../../models/patient";
import { AlertRequest } from "../../shared/components/alert/alert.type";
import { environment } from "../../../environments/environment";
import { InformacionProfesional } from "../../models/doctor";


const baseUrl = environment.baseUrl

@Injectable({
  providedIn: 'root'
})
export class ProfessionalInfoService {
  constructor(private http: HttpClient) { }


  updateProfessionalInfo(pi: InformacionProfesional){
    return this.http.put<AlertRequest>(baseUrl+ 'UpdateProfessionalInfo', pi)
  }
}
