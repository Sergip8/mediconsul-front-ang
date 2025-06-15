import { InformacionPersonal } from "./patient";

export class Doctor {
    id: number = 0;
    document_type: string = "Cédula"
    firstname: string = "";
    identity_number: string = "";
    lastname: string = "";
    tel: string = "";
    user_id: number = 0;
    informacion_personal: InformacionPersonal = new InformacionPersonal();
    Informacion_profesional: InformacionProfesional = new InformacionProfesional()

}
export class InformacionProfesional{
        id: number = 0
        hire_date: string = "2020-01-01";
        professional_number: string = ""
        work_shift: string = ""
        specialization: number = 0
        consultorios_id: number = 0
}

export interface DoctorAvailabilityInfo {
    id: number; // long en C# se convierte a number en TypeScript
    documentType: string;
    firstName: string;
    identityNumber: string;
    lastName: string;
    tel: string;
    address: string;
    speName: string
    citas: CitaDoctor[]; // List<CitaDoctor> en C# se convierte a un array en TypeScript
  }
  export interface CitaDoctor {
    slot: number; // short en C# se convierte a number en TypeScript
    appointment_start_time: Date; // DateTime en C# se convierte a Date en TypeScript
    state: string;
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
 