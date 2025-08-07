export interface PatientAppointment {
  id: number;
  appointment_start_time: string;
  created_date: string;
  doctor_document_type: string;
  doctor_firstname: string;
  doctor_identity_number: string;
  doctor_lastname: string;
  doctor_tel: string;
  response: string;
  slot: number;
  status: 'Scheduled' | 'Completed' | 'Cancelled'; // si hay un enum de estados
  type: number; // puede representar ID de especialidad
}