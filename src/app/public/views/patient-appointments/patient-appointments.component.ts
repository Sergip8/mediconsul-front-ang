import { Component, OnInit } from '@angular/core';
import { TableColumn, TableComponent } from '../../../shared/components/table/table.component';
import { Pagination } from '../../../shared/components/pagination/pagination-model';
import { AppointmentService } from '../../../_core/services/citas.service';
import { AuthService } from '../auth/auth.service';
import { AppointmentDetail, CitasTable } from '../../../models/cita';
import { citaColumns } from '../../../_core/schemas/citas-table-schema';
import { TratamientoService } from '../../../_core/services/tratamiento.service';
import { Tratamiento } from '../../../models/tratamiento';
import { DiagnosisDetailComponent } from "./diagnosis-detail.component";
import { NgFor } from '@angular/common';
import { MedicalReportComponent } from './medical-report.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-patient-appointments',
  imports: [TableComponent, DiagnosisDetailComponent, NgFor, MedicalReportComponent, ModalComponent],
  templateUrl: './patient-appointments.component.html',
  styleUrl: './patient-appointments.component.css'
})
export class PatientAppointmentsComponent implements OnInit {

loading = false;
citas: CitasTable[] = []
appointmentData: AppointmentDetail[] = []
appointmentSelected!: AppointmentDetail 
tratamiento: Tratamiento[] = []
pagination:Pagination = {
  count: 5,
  page: 1,
  size: 10
}

constructor(private appointmentService: AppointmentService, 
  private authService: AuthService, 
private tratamientoService: TratamientoService){}
  ngOnInit(): void {
    this.getPatientCitas()
  }
  getPatientCitas(){
    const userId = this.authService.getUserId()
    if(userId){
      this.appointmentService.getCitas(userId).subscribe({
        next: data =>{
          this.appointmentData =data
          console.log(data)
        }
      })

    }
  }
  getTratamientoCita(citaId: number){
    this.tratamientoService.getTratamientoCita(citaId).subscribe({
      next: data =>{
        this.tratamiento = data
        console.log(this.tratamiento)
      }
    })
  }
  
  patientColumns: TableColumn[] = citaColumns
  

  
  onPatientClick(patient: any): void {
    this.appointmentSelected = patient
    console.log(patient)
    this.getTratamientoCita(patient.id)
  }
  
  onSortChange(event: {field: any, direction: 'asc' | 'desc'}): void {
    console.log('Sort changed:', event);
    // Handle sorting, either client-side or server-side
    this.sortData(event.field, event.direction);
  }
  
  sortData(field: keyof CitasTable, direction: 'asc' | 'desc'): void {
    this.citas = [...this.citas].sort((a, b) => {
      const valueA = a[field];
      const valueB = b[field];
      
      if (valueA < valueB) {
        return direction === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
  isModalOpen = false;
  modalTitle = 'Sistema de Consultas Médicas';

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

}
