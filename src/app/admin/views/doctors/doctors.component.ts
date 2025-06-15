import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormComponent } from '../../../shared/components/form/form.component';
import { TableComponent } from '../../../shared/components/table/table.component';

import { Pagination } from '../../../shared/components/pagination/pagination-model';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { DoctorService } from '../../../_core/services/doctor.service';
import { doctorFormSchema } from '../../../_core/schemas/doctor-form-schema';
import { Doctor } from '../../../models/doctor';
import { PatientTable, SearchParameters } from '../../../models/patient';
import { patientColumns } from '../../../_core/schemas/patient-form-schema';
import { AlertType } from '../../../shared/components/alert/alert.type';

@Component({
  selector: 'app-doctors',
  imports: [FormComponent, TableComponent, ModalComponent],
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.css'
})
export class DoctorsComponent implements OnInit {

    doctorFormConfig = doctorFormSchema
    doctorData!: Doctor | null
    tableData: PatientTable[] = []
    doctorColumns = patientColumns
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
    showUnsaveChangesAlert = false
    @ViewChildren(FormComponent) form!: QueryList<FormComponent>;
    constructor(private doctors: DoctorService){}
  ngOnInit(): void {
    this.getDoctors()
  }
    onFormSubmit(formData: any): void {
      console.log(this.doctorData)
      console.log(formData)
      this.compareObjects(formData, this.doctorData)
      console.log(this.isEqual)
      if(this.isEqual)
        this.isModalOpen = false;
      else{
  
      }

    }
  
    onFormCancel(): void {
      console.log('Form cancelled');
      // Handle form cancellation
    }
    getDoctors(){
      this.doctors.getPagiantedDoctors(this.params).subscribe({
        next: data => {
          this.tableData = <PatientTable[]>data.data
          this.pagination.count = data.totalRecords
          
        }
      })
    }
    getdoctorSelected(doctorId: number){
      this.doctors.getDoctorInfo(doctorId).subscribe({
        next: data => {
          this.doctorData = data
          this.openModal()
        }
      })
    }

      onDoctorClick(doctor: any): void {
        this.doctorData = null
        this.getdoctorSelected(doctor.id)
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
    f.onSubmit();
    
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


}

