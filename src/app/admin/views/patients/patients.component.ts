import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormComponent } from '../../../shared/components/form/form.component';
import { TableComponent } from '../../../shared/components/table/table.component';
import { InformacionMedica, InformacionPersonal, Patient, PatientTable, SearchParameters } from '../../../models/patient';
import { AlertType } from '../../../shared/components/alert/alert.type';
import { PatientService } from '../../../_core/services/patient.service';

import { Pagination } from '../../../shared/components/pagination/pagination-model';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { finalize } from 'rxjs';
import { CommonService } from '../../../_core/services/common.service';
import { PersonalInfoService } from '../../../_core/services/personal-info.service';
import { MedicalInfoService } from '../../../_core/services/medical-info.service';
import { LoadingComponent } from "../../../shared/components/loading/loading";
import { NgIf } from '@angular/common';
import { patientColumns, patientFormSchema } from '../../../_core/schemas/patient-form-schema';

@Component({
  selector: 'app-patients',
  imports: [FormComponent, TableComponent, ModalComponent, LoadingComponent, NgIf],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css'
})
export class PatientsComponent implements OnInit {

    patientFormConfig = patientFormSchema
    patientData!: Patient | null
    tableData: PatientTable[] = []
    patientColumns = patientColumns
    userId = 0
    role = ""
    readonly alertType = AlertType;
    alert = this.alertType.Info
    showAlert = false
    alertMsg = ""
    params = new SearchParameters()
    loading = false;
    pagination:Pagination = {
      count: 5,
      page: 1,
      size: 10
    }
    isEqual = true
    isChange = false
    showUnsaveChangesAlert = false
    @ViewChildren(FormComponent) form!: QueryList<FormComponent>;
    constructor(private patient: PatientService,
      private commonService: CommonService,
      private personalInfoService: PersonalInfoService,
      private medicalInfoService: MedicalInfoService){}
  ngOnInit(): void {
    this.getPatients()
  }
    onFormSubmit(formData: any): void {
      console.log(this.patientData)
      console.log(formData)
      const medicalInfo = {id: this.patientData?.informacion_medica.id, ...formData.informacion_medica}
      const personalInfo = {id: this.patientData?.informacion_personal.id, ...formData.informacion_personal}
      
      if (this.hasChanges(this.patientData?.informacion_personal, personalInfo)) {
        this.updateInformacionPersonal(personalInfo);
      }
    
      if (this.hasChanges(this.patientData?.informacion_medica, medicalInfo)) {
        this.updateInformacionMedica(medicalInfo);
      }
      const mainFieldsChanged = this.hasChanges(
        this.excludeNested(this.patientData), 
        this.excludeNested(formData)
      );
      if (mainFieldsChanged) {
        this.updateMainData(this.excludeNested(formData));
      }
   
        this.isModalOpen = false;
   

    }
    updateInformacionPersonal(currentData: InformacionPersonal): void {
  this.personalInfoService.updatePersonalInfo(currentData).pipe(
    finalize(() => {
      this.commonService.updateAlert({
        message: 'Información personal actualizada.',
        alertType: AlertType.Success,
        show: true
      });
    })
  ).subscribe({
    next: (data) => {
      // Optionally update local patientData
      if (this.patientData) {
        this.patientData.informacion_personal = { ...currentData };
      }
    },
    error: (err) => {
      this.commonService.updateAlert({
        message: 'Error al actualizar información personal.',
        alertType: AlertType.Danger,
        show: true
      });
    }
  });
}
    updateInformacionMedica(currentData: InformacionMedica): void {
  this.medicalInfoService.updateMedicalInfo(currentData).pipe(
    finalize(() => {
      this.commonService.updateAlert({
        message: 'Información médica actualizada.',
        alertType: AlertType.Success,
        show: true
      });
    })
  ).subscribe({
    next: (data) => {
      if (this.patientData) {
        this.patientData.informacion_medica = { ...currentData };
      }
    },
    error: (err) => {
      this.commonService.updateAlert({
        message: 'Error al actualizar información médica.',
        alertType: AlertType.Danger,
        show: true
      });
    }
  });
}
    updateMainData(currentData: any): void {
  this.patient.updatePatientData(currentData).pipe(
    finalize(() => {
      this.commonService.updateAlert({
        message: 'Datos principales actualizados.',
        alertType: AlertType.Success,
        show: true
      });
    })
  ).subscribe({
    next: (data) => {
      if (this.patientData) {
        Object.assign(this.patientData, currentData);
      }
    },
    error: (err) => {
      this.commonService.updateAlert({
        message: 'Error al actualizar datos principales.',
        alertType: AlertType.Danger,
        show: true
      });
    }
  });
}

    hasChanges(original: any, current: any): boolean {
      return JSON.stringify(original) !== JSON.stringify(current);
    }
    
    // Excluir objetos anidados para comparar solo campos principales
    excludeNested(data: any): any {
      const { informacion_personal, informacion_medica, ...mainData } = data;
      return mainData;
    }
  
    onFormCancel(isChange: boolean): void {
  if (isChange) {
    const confirmCancel = window.confirm('Hay cambios sin guardar. ¿Seguro que quieres salir?');
    if (confirmCancel) {
      this.isModalOpen = false;
    }
  } else {
    this.isModalOpen = false;
  }
}
    
    getPatients(){
      this.patient.getPagiantedPatients(this.params).subscribe({
        next: data => {
          this.tableData = <PatientTable[]>data.data
          this.pagination.count = data.totalRecords
          
        }
      })
    }
    getPatientSelected(patientId: number){
        this.openModal()
        this.loading = true
      this.patient.getPatientInfo(patientId).pipe(finalize(()=> this.loading = false)).subscribe({
        next: data => {
          this.patientData = data
        
        }
      })
    }

      onPatientClick(patient: any): void {
        this.patientData = null
        this.getPatientSelected(patient.id)
      }
      
      onSortChange(event: {field: any, direction: 'asc' | 'desc'}): void {
        console.log('Sort changed:', event);
        // Handle sorting, either client-side or server-side
        this.sortData(event.field, event.direction);
      }
      
      sortData(field: keyof PatientTable, direction: 'asc' | 'desc'): void {
        this.tableData = [...this.tableData].sort((a, b) => {
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
modalTitle = 'Paciente';

openModal(): void {
  this.isModalOpen = true;
}


closeModal() {
  console.log("close modal parent")
  this.form.forEach((f) => {
    f.onCancel();
    
  });
 
     
}
compareObjects(object1: any, object2: any){
  const keys = Object.keys(object1)

  keys.forEach(k => {
    if(typeof object1[k] === 'object'){
      this.compareObjects(object1[k], object2[k])
      return 
    }

    if(object1[k] != object2[k]){
      if(!k.endsWith("id")){
        console.log(object1[k])
        this.isEqual = false
      }

    }
  })
}
createPatient(formData: any){
    const patient = <Patient>formData
    patient.user_id = this.userId
    console.log(patient)
    this.patient.createPatient(patient).pipe(
              finalize (() => {
                this.commonService.updateAlert({
                  message: this.alertMsg,
                  alertType: this.alert,
                  show: true
                })
              })
            ).subscribe({
          next: data => {
            console.log(data)
              if(data.isError){
                this.alert = AlertType.Danger
              }else{
                this.alert = AlertType.Success
                
              }
              this.alertMsg = data.message
    
          },error: e => {
            console.log(e)
            this.alert = AlertType.Danger
            this.alertMsg = e.error.message
          }
        })
  }


}

