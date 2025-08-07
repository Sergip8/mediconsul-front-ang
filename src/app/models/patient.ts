import { UserRequest } from "../public/views/auth/auth-models";

export class Patient {
    id: number = 0;
    document_type: string = "Cédula"
    firstname: string = "";
    identity_number: string = "";
    lastname: string = "";
    phone: string = "";
    user_id: number = 0;
    informacion_personal: InformacionPersonal = new InformacionPersonal();
    informacion_medica: InformacionMedica = new InformacionMedica();
}

export class InformacionPersonal {
    id: number = 0;
    address: string = "";
    birth_date: string = "";
    marital_status: string = "2020-01-01";
    gender: string = "";
}
export class InformacionMedica {
    id: number = 0;
    blood_type: string = "O+";
    height: number = 0;
    weight: number = 0;
}
export enum DocumentType{
    'DNI', 'Pasaporte', 'Cédula', 'TI'
}
export class SearchParameters {
    // Propiedades de la clase
    searchTerm: string = "";
    orderCriteria: string = "id";
    page: number = 1;
    size: number = 10;
   orderDirection: string = "ASC";
}  

export interface PatientTable{
    id: number
    firstName: string
    lastName: string
    document_type: string
    identity_number: string
    phone: string

}
export interface PaginatedRequest<T>{
    data: T[]
    totalRecords: number
}