import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { loadStripe, Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { CreateCita,  } from '../../../models/cita';
import { PaymentIntent, StripePaymentService } from '../../../_core/services/stripe.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { DoctorAvailabilityInfo } from '../../../models/doctor';

import { firstValueFrom } from 'rxjs';
import { specializationsWithSlots } from '../../../shared/utils/constans';

@Component({
  selector: 'app-stripe-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CurrencyPipe],
  template: `
    <div class="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 font-sans">
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Confirmar y Pagar</h2>
        <div class="border-b pb-4">
          <!-- Mostrar los detalles de la cita dinámicamente -->
          <div *ngIf="appointmentDetails" class="space-y-1">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Detalles de la Cita</p>
            <p class="text-lg font-bold text-gray-800">{{ appointmentDetails.doctorName }}</p>
            <p class="text-sm text-gray-600">{{ appointmentDetails.specialty }}</p>
            <p class="text-sm text-gray-600">Fecha: {{ appointmentDetails.date }}</p>
            <p class="text-sm text-gray-600">Hora: {{ appointmentDetails.time }}</p>
          </div>
          <div *ngIf="!appointmentDetails" class="text-red-500 text-sm">
            No se pudieron cargar los detalles de la cita.
          </div>
          
          <div class="mt-4">
            <p class="text-gray-600">Total a Pagar</p>
            <!-- Usamos el pipe Currency para formatear el monto -->
            <p class="text-3xl font-bold text-blue-600">{{ amount | currency: currencyCode : 'symbol' : '1.0-0' }}</p>
          </div>
        </div>
      </div>

      <form [formGroup]="paymentForm" (ngSubmit)="processPayment()" *ngIf="!isLoading">
        <!-- Información del cliente -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            formControlName="email"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="tu@email.com"
          />
          <div *ngIf="paymentForm.get('email')?.errors?.['required'] && paymentForm.get('email')?.touched" 
               class="text-red-500 text-sm mt-1">El email es requerido</div>
          <div *ngIf="paymentForm.get('email')?.errors?.['email'] && paymentForm.get('email')?.touched" 
               class="text-red-500 text-sm mt-1">Email inválido</div>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
          <input
            type="text"
            formControlName="name"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nombre completo"
          />
          <div *ngIf="paymentForm.get('name')?.errors?.['required'] && paymentForm.get('name')?.touched" 
               class="text-red-500 text-sm mt-1">El nombre es requerido</div>
        </div>

        <!-- Elemento de tarjeta de Stripe -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Información de la tarjeta</label>
          <div 
            #cardElement 
            class="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          ></div>
          <div *ngIf="cardError" class="text-red-500 text-sm mt-1">{{cardError}}</div>
        </div>

        <!-- Botones de acción -->
        <div class="flex space-x-3">
          <button
            type="button"
            (click)="onCancel()"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            [disabled]="processing"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            [disabled]="processing || !paymentForm.valid"
          >
            <span *ngIf="!processing">Pagar {{ amount | currency: currencyCode : 'symbol' : '1.0-0' }}</span>
            <span *ngIf="processing" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </span>
          </button>
        </div>
      </form>

      <!-- Estado de carga -->
      <div *ngIf="isLoading" class="flex items-center justify-center py-8">
        <div class="text-center">
          <svg class="animate-spin h-8 w-8 text-blue-600 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-gray-600">Cargando...</p>
        </div>
      </div>

      <!-- Mensaje de éxito -->
      <div *ngIf="paymentSuccess" class="text-center py-8">
        <div class="mb-4">
          <svg class="h-16 w-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 class="text-xl font-bold text-green-600 mb-2">¡Pago Exitoso!</h3>
        <p class="text-gray-600 mb-4">Tu cita ha sido confirmada.</p>
        <button 
          (click)="onSuccess()"
          class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Continuar
        </button>
      </div>
    </div>
  `,
  styles: [`
    .StripeElement {
      background-color: white;
      padding: 10px 12px;
      border-radius: 6px;
      border: 1px solid #d1d5db;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
      transition: border-color 0.15s ease;
    }

    .StripeElement--focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
    }

    .StripeElement--invalid {
      border-color: #ef4444;
    }
  `]
})
export class StripePaymentComponent implements OnInit {
  @ViewChild('cardElement', { static: false }) cardElement!: ElementRef;
  
  amount: number = 0;
  currencyCode: string = 'USD'; // Código de la moneda por defecto
  citaRecibida!: CreateCita;
  
  // Objeto para mostrar los detalles de la cita en el template
  appointmentDetails: {
    doctorName: string;
    specialty: string;
    date: string;
    time: string;
  } | null = null;
  
  paymentForm: FormGroup;
  processing = false;
  isLoading = true;
  paymentSuccess = false;
  cardError: string | null = null;
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  cardElementStripe: StripeCardElement | null = null;
  
  private stripePublicKey = 'pk_test_your_stripe_public_key'; // Reemplaza con tu clave pública

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private stripeService: StripePaymentService,
    private router: Router,
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.citaRecibida = navigation.extras.state['cita'];
      console.log('Datos de la cita recibidos para el pago:', this.citaRecibida);
    }
    this.stripePublicKey = stripeService.stripeKey;
    
    this.paymentForm = this.fb.group({
      email: [this.authService.getEmail(), [Validators.required, Validators.email]],
      name: ['', Validators.required]
    });

    this.loadAppointmentDetails();
  }

  // Carga y formatea los detalles de la cita
  private loadAppointmentDetails(): void {
    if (this.citaRecibida && this.citaRecibida.doctor) {
      const doctorInfo = this.citaRecibida.doctor as DoctorAvailabilityInfo;
      const appointmentDate = new Date(this.citaRecibida.appointmentStartTime);
      const speItem = specializationsWithSlots.find(spe => spe.specialization == doctorInfo.speName); // Usar duración por especialidad o 20 minutos por defecto
      this.appointmentDetails = {
        doctorName: `Dr. ${doctorInfo.firstName} ${doctorInfo.lastName}`,
        specialty: doctorInfo.speName,
        date: this.formatDate(appointmentDate),
        time: this.formatTime(appointmentDate)
      };
      const slot = speItem ? speItem.slot : 20; // Usar duración por especialidad o 20 minutos por defecto
      // Actualizar el monto y la moneda para el pago
      this.amount = doctorInfo.unitPrice*slot*0.1*(110-slot)/100;
      this.currencyCode = doctorInfo.currency;

      // Actualizar el formulario con el nombre del usuario si está disponible
      // (asumiendo que authService tiene un método para obtener el nombre)
      const userName = this.authService.getUserName(); 
      if (userName) {
        this.paymentForm.get('name')?.setValue(userName);
      }
    }
  }

  ngOnInit(): void {
    this.initializeStripe();
  }

  private async initializeStripe(): Promise<void> {
    try {
      this.stripe = await loadStripe(this.stripePublicKey);
      
      if (this.stripe) {
        this.elements = this.stripe.elements();
        this.isLoading = false;
        
        // Esperar a que el ViewChild esté disponible
        setTimeout(() => {
          this.createCardElement();
        }, 100);
      }
    } catch (error) {
      console.error('Error inicializando Stripe:', error);
      //this.paymentError.emit('Error inicializando el sistema de pagos');
    }
  }

  private createCardElement(): void {
    if (!this.elements || !this.cardElement) return;

    this.cardElementStripe = this.elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#424770',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
        invalid: {
          color: '#9e2146',
        },
      },
      hidePostalCode: true,
    });

    this.cardElementStripe?.mount(this.cardElement.nativeElement);

    this.cardElementStripe?.on('change', (event) => {
      if (event.error) {
        this.cardError = event.error.message;
      } else {
        this.cardError = null;
      }
    });
  }

  async processPayment(): Promise<void> {
    if (!this.stripe || !this.cardElementStripe || !this.citaRecibida) {
      return;
    }

    this.processing = true;
    this.cardError = null;

    try {
      // 1. Crear Payment Intent en el backend
      const paymentIntentData = {
        amount: this.amount * 100, // Stripe maneja centavos
        currency: this.currencyCode,
        appointmentData: this.citaRecibida,
        metadata: {
          customer_email: this.paymentForm.value.email,
          customer_name: this.paymentForm.value.name,
          appointment_type: 'medical_appointment'
        }
      };

      const paymentIntent: PaymentIntent = await firstValueFrom(this.stripeService.createPaymentIntent(paymentIntentData));
      console.log(paymentIntent)
      if (!paymentIntent?.clientSecret) {
        throw new Error('Error creando el intento de pago');
      }

      // 2. Confirmar el pago con Stripe
      const { error, paymentIntent: confirmedPayment } = await this.stripe.confirmCardPayment(
        paymentIntent.clientSecret,
        {
          payment_method: {
            card: this.cardElementStripe,
            billing_details: {
              name: this.paymentForm.value.name,
              email: this.paymentForm.value.email,
            },
          },
        }
      );
      console.log(confirmedPayment)
      if (error) {
        this.cardError = error.message || 'Error procesando el pago';
        this.processing = false;
        return;
      }

      // 3. Pago exitoso
      if (confirmedPayment?.status === 'succeeded') {
        const date = new Date(this.citaRecibida.appointmentStartTime).toLocaleString("sv-SE", { timeZone: "America/Bogota" }).replace(" ", "T");
         const citaSelected = {
            slot: this.citaRecibida.slot,
            appointmentStartTime: date,
            type: this.citaRecibida.type,
            doctorId: this.citaRecibida.doctorId,
            userId: this.citaRecibida.userId
          }
        this.paymentSuccess = true;
        this.processing = false;
        
        // Notificar al componente padre si fuera necesario
        //this.paymentCompleted.emit(...);
      }

    } catch (error: any) {
      console.error('Error procesando pago:', error);
      this.cardError = error.message || 'Error procesando el pago';
      this.processing = false;
      //this.paymentError.emit(this.cardError || "");
    }
  }
  
  onCancel(): void {
    // Regresar a la página anterior
    this.router.navigate(['/']);
  }

  onSuccess(): void {
    // Redireccionar o realizar otra acción después del pago exitoso
    this.router.navigate(['/']);
  }

  private formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  }

  private formatTime(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    return date.toLocaleTimeString('es-ES', options);
  }
}