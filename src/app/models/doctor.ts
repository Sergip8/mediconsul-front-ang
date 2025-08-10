import { InformacionPersonal } from "./patient";

export class Doctor {
    id: number = 0;
    document_type: string = "ID_Card"
    firstname: string = "";
    identity_number: string = "";
    lastname: string = "";
    phone: string = "";
    user_id: number = 0;
    informacion_personal: InformacionPersonal = new InformacionPersonal();
    informacion_profesional: InformacionProfesional = new InformacionProfesional()

}
export class InformacionProfesional{
        id: number = 0
        hire_date: string = "2020-01-01";
        professional_number: string = ""
        work_shift: string = "AM"
        specialization: number = 1
        consultorios_id: number = 1
}

export interface DoctorAvailabilityInfo {
    id: number; 
    documentType: string;
    firstName: string;
    identityNumber: string;
    lastName: string;
    phone: string;
    address: string;
    speName: string
    unitPrice: number
    appointmentSlot: number
    currency: string
    modality: AppointmentModality
    citas: CitaDoctor[];
    locations: DoctorLocations[]; 
  }
  export interface CitaDoctor {
    slot: number; // short en C# se convierte a number en TypeScript
    appointment_start_time: Date; // DateTime en C# se convierte a Date en TypeScript
    state: string;
  }
  export interface DoctorLocations{
    id: number;
    latitude: number;
    longitude: number;
    direction: string;
    neighbourhood: string;
    reference: string;
    locality: string;
    city: string;
    postalCode: string | null;
    country: string;
  }
  export interface DoctorAvailabilityRequest {
    doctores: DoctorAvailabilityInfo[]; // List<DoctorvailabilityInfo> en C# se convierte a un array en TypeScript
    totalCount: number; // int en C# se convierte a number en TypeScript
  }

  export class DoctorAvailabilityPayload{
    page: number = 1
    pageSize: number = 10
    especializacionId = 4
 }
 export interface DoctorTable{
    id: number
    firstname: string
    lastname: string
    document_type: string
    identity_number: string
    phone: string

}
 export interface DoctorMainRegister{
    firstname: string
    lastname: string
    phone: string

}
export enum AppointmentModality {
    Virtual = "Virtual",
    InPerson = "InPerson",
    Hybrid = "Hybrid"
} 
export interface DoctorRegisterForm {
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
}
export interface LocationData {
    id: number;
    address: string;
    neighbourhood: string;
    locality: string;
    city: string;
    latitude: number;
    longitude: number;
}
 