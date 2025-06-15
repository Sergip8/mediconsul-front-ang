import { Component } from '@angular/core';

import { AppointmentDoctorResponse } from '../../../../models/appointment-doctor-response';
import { AppointmentAvaiable } from '../../../../models/appointment-avaiable';
import { AppointmentRespose } from '../../../../models/appointment-response';
import { AppointmentService } from '../../../../_core/services/citas.service';
import { SelectData } from '../../../../shared/components/select/selectModel';
import { especialidades } from '../../../../_core/schemas/citas-table-schema';
import { SelectComponent } from "../../../../shared/components/select/select-check";
import { PatientService } from '../../../../_core/services/patient.service';
import { Patient, PatientTable, SearchParameters } from '../../../../models/patient';
import { patientColumns } from '../../../../_core/schemas/patient-form-schema';
import { TableComponent } from "../../../../shared/components/table/table.component";
import { Pagination } from '../../../../shared/components/pagination/pagination-model';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePickerComponent } from '../datetime-picker/date-picker.component';
import { TimePickerComponent } from '../datetime-picker/time-picker.component';


@Component({
  selector: 'app-appointment-register',
  templateUrl: './appointment-register.component.html',
  styleUrls: ['./appointment-register.component.scss'],
  imports: [SelectComponent, TableComponent, ReactiveFormsModule, DatePickerComponent, TimePickerComponent]
})
export class AppointmentRegisterComponent {
loading: boolean = false;
onSortChange($event: { field: string; direction: "asc"|"desc"; }) {
throw new Error('Method not implemented.');
}
onPatientClick($event: any) {
throw new Error('Method not implemented.');
}

  date!: Date
  centerName!: any
  spe: any
  cc!: string
  patient = []
  doctorRequest!: AppointmentDoctorResponse
  AppmentRes!: AppointmentAvaiable[]
  appmentRegister!: AppointmentRespose
  patientData!: Patient | null
  tableData: PatientTable[] = []
  patientColumns = patientColumns
  params = new SearchParameters()
  searchInput = ""
  selectSpe:SelectData = {
    placeholder: "Seleciona la especialidad",
    list: Object.entries(especialidades).map((v) =>Object.assign({
      id: v[0],
      name: v[1],
      type: ""
    }))
  }
   pagination:Pagination = {
        count: 5,
        page: 1,
        size: 8
      }
  selectPatient:SelectData ={
    placeholder: "busca al paciente",
    list: []
  } 

  constructor(private appointmentService: AppointmentService, private patientService: PatientService){}

  getCenter(name: any){
    this.centerName = name?.name
    console.log(this.centerName)
   
  }
  getSpecialization(spe: any){
    this.spe = spe  
    console.log(spe)
    console.log(this.patient)

  }
  getDate(date: Date){
    this.date = date
    console.log(date)
  }
  sendInfo(){
    this.doctorRequest = {
      specialization: this.spe,
      patientCC: "",
      medicalCenterName: this.centerName,
      appointmentDate: this.date
    }
    console.log(this.doctorRequest)

    // this.appointmentService.getAppointmentResponse(this.doctorRequest).subscribe({
    //   next: res => this.AppmentRes = res,
    //   error: err => console.log(err)
    // })
  }


  getPatients(search: string){
    this.params.searchTerm = search
 this.patientService.getPagiantedPatients(this.params).subscribe({
  next: data => {
    if(data?.data.length>0)
    this.selectPatient.list = data.data.map((d: any) => Object.assign({id: d.id, name: d.firstName +" "+ d.lastName, type: d.email}))
  }
 })
  }
  // }
  // appointmentResponse(res: AppointmentAvaiable ){
  //   this.mapToAppomentResponse(res)
  //   this.appointmentService.registerAppointment(this.appmentRegister).subscribe({
  //     next: res => console.log(res)
  //   })
    
  // }
  // mapToAppomentResponse(res: AppointmentAvaiable ){
  //  this.appmentRegister ={
  //     specialization: this.spe,
  //     patientCC: this.cc,
  //     doctorId: res.id,
  //     appointmentDate: res.appointmentDate,
  //     medicalCenterName: this.centerName?.name,
  //     address:this.centerName?.address,
  //     roomNumber: res.numberRoom
  //   }
    
    
  // }
  searchPatient(search: string){
    if(search.length >= 4){
      this.getPatients(search)
    }

    console.log(search)
  }
}
