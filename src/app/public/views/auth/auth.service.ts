import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, finalize, Observable} from "rxjs";
import {AuthResponse} from "./auth.response";
import { AuthRequest, LoginRequest, LoginResponse, RegistrationResponse } from './auth-models';
import { environment } from '../../../../environments/environment';
import { AlertRequest } from '../../../shared/components/alert/alert.type';

const baseUrl = environment.baseUrl

export interface UserMenu {
   
    email: string,
    roles: string[],
    avatar: string
  };

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getUserName() {
    return ""
  }
  private endpoints: any = {
    signin: baseUrl+"Login",
    signup: baseUrl+"Register",
  };
  tokenKey = "token"
  

  private roles = new BehaviorSubject<string[] | null>(null) 
  roles$ = this.roles.asObservable()
  private email = new BehaviorSubject<string | null>(null) 
  email$ = this.email.asObservable()

  private user = new BehaviorSubject<LoginRequest | null>(null) 
  user$ = this.user.asObservable()

  updateRoles(){
    this.roles.next(this.getRole())
  }
  updateEmail(){
    this.roles.next(this.getEmail())
  }
  removeRoles(){
    this.roles.next(null)
  }

  updateUser(user: LoginRequest){
    this.user.next(user)
    this.setToken(user.token)
  }

  constructor(private httpClient: HttpClient) { }

  signIn(data: LoginResponse): Observable<LoginRequest> {
    return this.httpClient.post<LoginRequest>(this.endpoints.signin, data)
  }
  signUp(data: RegistrationResponse){
    return this.httpClient.post<AlertRequest>(this.endpoints.signup, data);
  }

  setToken(value: string) {
    localStorage.setItem(this.tokenKey, value);
}

getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
}

removeToken() {
    localStorage.removeItem(this.tokenKey);
}
decodeToken(){
  const token = this.getToken()
  if(token){
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/_/g, '+').replace(/_/g, '+')
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(c => {
        return '%' + ('00'+ c.charCodeAt(0).toString(16)).slice(-2)
      }).join('')
    )
    return JSON.parse(jsonPayload)

  }
  else
  return null
}
getRole(){
  if (this.decodeToken())
  return this.decodeToken().role.split(",")
 return null
}
getEmail(){
  if (this.decodeToken())
  return this.decodeToken().email
 return null
}
getUserId(){
  const userId = this.decodeToken()?.["unique_name"]
  if(userId)
    return userId
  return null
}


}
