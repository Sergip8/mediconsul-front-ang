// doctor-register.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GeocodingService } from '../../../../_core/services/geocoding.service';
import { specializationsWithSlots } from '../../../../shared/utils/constans';
import { Doctor, DoctorLocations, DoctorMainRegister, DoctorTable, InformacionProfesional } from '../../../../models/doctor';
import { DoctorRegister, RegistrationResponse, Role } from '../auth-models';
import { DoctorService } from '../../../../_core/services/doctor.service';

export interface doctorRegisterForm {
    firstname: string;
    lastname: string;
    phone: string;
    professional_number: string;
    latitude: number;
    longitude: number;
    speciality: string;
    neighbourhood: string;
    locality: string;
    city: string;
    email: string;
    password: string;
    country: string;
    postalCode: string;
}

export interface NominatimResponse {
    lat: string;
    lon: string;
    display_name: string;
    address: Address;

}
export interface Address {
    street: string;
    city: string;
    state: string;
    suburb: string;
    neighbourhood: string;
    country: string;
    postcode: string;
    residential?: string;
    municipality?: string;
  
}

@Component({
    selector: 'app-doctor-register',
    templateUrl: './doctor-signup.component.html',
    standalone: false,
    styleUrls: ['./doctor-signup.component.css']
})
export class DoctorSignupComponent implements OnInit, OnDestroy {
    registerForm: FormGroup;
    locationSearchTerm = new Subject<string>();
    locationResults: NominatimResponse[] = [];
    isLocationDropdownOpen = false;
    selectedLocation: NominatimResponse | null = null;
    isLoadingLocation = false;
    passwordVisible = false;
    private destroy$ = new Subject<void>();

    specialities = specializationsWithSlots

    constructor(
        private fb: FormBuilder,
        private geocodingService: GeocodingService,
        private doctorService: DoctorService
    ) {
        this.registerForm = this.fb.group({
            firstname: ['', [Validators.required, Validators.minLength(2)]],
            lastname: ['', [Validators.required, Validators.minLength(2)]],
            phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
            professional_number: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            speciality: ['', [Validators.required]],
            location: ['', [Validators.required]]
        });
    }

    ngOnInit(): void {
        this.setupLocationSearch();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private setupLocationSearch(): void {
        this.locationSearchTerm.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap(term => {
                if (term.length < 3) {
                    return of([]);
                }
                this.isLoadingLocation = true;
                return this.geocodingService.searchLocation(term);
            }),
            takeUntil(this.destroy$)
        ).subscribe({
            next: (results) => {
                this.locationResults = results;
                console.log('Location search results:', results);
                this.isLoadingLocation = false;
                this.isLocationDropdownOpen = results.length > 0;
            },
            error: (error) => {
                console.error('Error searching location:', error);
                this.isLoadingLocation = false;
                this.locationResults = [];
            }
        });
    }

    onLocationSearch(event: Event): void {
        const target = event.target as HTMLInputElement;
        this.locationSearchTerm.next(target.value);
    }

    selectLocation(location: NominatimResponse): void {
        this.selectedLocation = location;
        this.registerForm.get('location')?.setValue(location.display_name);
        this.isLocationDropdownOpen = false;
        
        // Parse the display_name to extract location parts
        this.parseLocationData(location);
    }

    private parseLocationData(location: NominatimResponse): void {
        // This is a simplified parsing - you might need to adjust based on your API response format
        const address = location.address;
        const neighbourhood = address.neighbourhood || address.residential || '';
        const locality = address.suburb || '';
        const city = address.city || address.municipality || '';
        const country = address.country || '';
        const postalCode = address.postcode || '';

        // Update the form with location data (these are not visible fields in the form)
        this.registerForm.addControl('latitude', this.fb.control(parseFloat(location.lat)));
        this.registerForm.addControl('longitude', this.fb.control(parseFloat(location.lon)));
        this.registerForm.addControl('neighbourhood', this.fb.control(neighbourhood));
        this.registerForm.addControl('locality', this.fb.control(locality));
        this.registerForm.addControl('city', this.fb.control(city));
        this.registerForm.addControl('country', this.fb.control(country));
        this.registerForm.addControl('postalCode', this.fb.control(postalCode));
    }

    togglePasswordVisibility(): void {
        this.passwordVisible = !this.passwordVisible;
    }

    closeLocationDropdown(): void {
        setTimeout(() => {
            this.isLocationDropdownOpen = false;
        }, 150);
    }

    onSubmit(): void {
        if (this.registerForm.valid && this.selectedLocation) {
            const formData: doctorRegisterForm = {
                firstname: this.registerForm.get('firstname')?.value,
                lastname: this.registerForm.get('lastname')?.value,
                phone: this.registerForm.get('phone')?.value,
                professional_number: this.registerForm.get('professional_number')?.value,
                latitude: this.registerForm.get('latitude')?.value,
                longitude: this.registerForm.get('longitude')?.value,
                speciality: this.registerForm.get('speciality')?.value,
                neighbourhood: this.registerForm.get('neighbourhood')?.value,
                locality: this.registerForm.get('locality')?.value,
                city: this.registerForm.get('city')?.value,
                email: this.registerForm.get('email')?.value,
                password: this.registerForm.get('password')?.value,
                country: this.registerForm.get('country')?.value || 'colombia',
                postalCode: this.registerForm.get('postalCode')?.value || ''
            };
            const doctorRegister = this.mapToDoctorRegister(formData);
            this.doctorService.registerDoctor(doctorRegister).subscribe({
                next: (response) => {
                    console.log('Doctor registered successfully:', response);},
                error: (error) => {
                    console.error('Error registering doctor:', error);
                }
                })
            console.log('Form Data:', formData);
            
        } else {
            this.markAllFieldsAsTouched();
        }
    }
    

    private markAllFieldsAsTouched(): void {
        Object.keys(this.registerForm.controls).forEach(key => {
            this.registerForm.get(key)?.markAsTouched();
        });
    }

    getFieldError(fieldName: string): string {
        const field = this.registerForm.get(fieldName);
        if (field?.errors && field.touched) {
            if (field.errors['required']) return `${this.getFieldLabel(fieldName)} es requerido`;
            if (field.errors['minlength']) return `${this.getFieldLabel(fieldName)} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
            if (field.errors['email']) return 'Ingrese un email válido';
            if (field.errors['pattern']) return 'Formato inválido';
        }
        return '';
    }

    private getFieldLabel(fieldName: string): string {
        const labels: {[key: string]: string} = {
            'firstname': 'Nombre',
            'lastname': 'Apellido',
            'phone': 'Teléfono',
            'professional_number': 'Número profesional',
            'email': 'Email',
            'password': 'Contraseña',
            'speciality': 'Especialidad',
            'location': 'Ubicación'
        };
        return labels[fieldName] || fieldName;
    }
    trackByLocation(index: number, location: any): string {
    return location?.id || index.toString();
}
mapToDoctorRegister(data: doctorRegisterForm): DoctorRegister {
  // Doctor
  const doctor: DoctorMainRegister = {
  firstname: data.firstname,
  lastname: data.lastname,
  phone: data.phone,
  }
  // InformacionProfesional (puede estar duplicada si backend lo requiere separado)
  const profesionalInfo = new InformacionProfesional();
  profesionalInfo.professional_number = data.professional_number;
  profesionalInfo.specialization = Number(data.speciality);

  // Location
  const location: DoctorLocations = {
    id: 0,
    latitude: data.latitude,
    longitude: data.longitude,
    direction: "", // No está en el objeto original
    neighbourhood: data.neighbourhood,
    reference: "", // No está en el objeto original
    locality: data.locality,
    city: data.city,
    postalCode: data.postalCode ?? null,
    country: data.country || 'colombia' 
  };

  // Registro
  const doctorRegister: RegistrationResponse = {
    email: data.email,
    password: data.password,
    role: Role.DOCTOR
  };

  return {
    doctor,
    profesionalInfo,
    location,
    doctorRegister
  };
}
}