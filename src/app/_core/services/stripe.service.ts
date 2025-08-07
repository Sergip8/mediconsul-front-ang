import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PaymentIntent {
  clientSecret: string;
  amount: number;
  currency: string;
  id: string
}

export interface PaymentIntentRequest {
  amount: number;
  currency: string;
  appointmentData: any;
  metadata?: any;
}

@Injectable({
  providedIn: 'root'
})
export class StripePaymentService {
  private apiUrl = environment.baseUrl
    stripeKey = environment.stripePublicKey
  constructor(private http: HttpClient) {}

  createPaymentIntent(paymentData: PaymentIntentRequest): Observable<PaymentIntent> {
    return this.http.post<any>(`${this.apiUrl}create-payment-intent`, paymentData).pipe(
    map(raw => ({
      clientSecret: raw.ClientSecret,
      amount: raw.Amount,
      currency: raw.Currency,
      id: raw.Id
    })))
  }

  confirmPayment(paymentIntentId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}confirm-payment`, { paymentIntentId });
  }
}