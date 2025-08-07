import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Patient, PatientTable, SearchParameters, PaginatedRequest } from '../../models/patient';
import {environment} from "../../../environments/environment";
import { UserRequest } from '../../public/views/auth/auth-models';
import { firstValueFrom } from 'rxjs';

const baseUrl = environment.baseUrl

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }


  getPagiantedUsers(params: SearchParameters){
    return this.http.post<PaginatedRequest<UserRequest>>(baseUrl+ 'GetPaginatedUsers', params)
  }

      getUserFormData(query: string){
        console.log(query)
        const url = `${baseUrl}GetUserFormInfo/${query}`;
        return firstValueFrom(this.http.get<any[]>(url)).then(resultados =>
      resultados.map(user => ({
      id: user.id,
      value: user.email
    }))
  );
    }
}

