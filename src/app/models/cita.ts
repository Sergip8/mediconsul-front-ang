export interface CitasTable{
    id: number
    appointment_start_time: Date
    response: string
    type: string
    state: string
}

export interface AppointmentDetail {
    id: number;
    slot: string;
    appointment_start_time: string;
    created_date: string;
    response: string;
    state: string;
    type: string;
    doctor_document_type: string;
    doctor_firstname: string;
    doctor_identity_number: string;
    doctor_lastname: string;
    doctor_tel: string;
  }
  export interface AppointmentDoctorDetail {
    id: number;
    slot: string;
    appointment_start_time: string;
    created_date: string;
    response: string;
    state: string;
    type: string;
    patient_document_type: string;
    patient_firstname: string;
    patient_identity_number: string;
    patient_lastname: string;
    patient_tel: string;
  }
  export interface CreateCita{
    slot: number
    appointmentStartTime: Date,
    type: number,
    doctorId: number
    userId: number
  } 