import { Component, QueryList, ViewChildren } from '@angular/core';
import { PatientTable, SearchParameters } from '../../../models/patient';
import { CitasTable } from '../../../models/cita';
import { citaColumns } from '../../../_core/schemas/citas-table-schema';
import { AlertType } from '../../../shared/components/alert/alert.type';
import { Pagination } from '../../../shared/components/pagination/pagination-model';
import { FormComponent } from '../../../shared/components/form/form.component';
import { DoctorService } from '../../../_core/services/doctor.service';
import { AppointmentService } from '../../../_core/services/citas.service';
import { TableComponent } from "../../../shared/components/table/table.component";

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css',
  imports: [TableComponent]
})
export class AppointmentsComponent {


  doctorData!: CitasTable | null
  tableData: CitasTable[] = []
  citaColumns = citaColumns
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
  constructor(private cita: AppointmentService){}
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
    this.cita.getPagiantedAppointments(this.params).subscribe({
      next: data => {
        this.tableData = <CitasTable[]>data.data
        this.pagination.count = data.totalRecords
        
      }
    })
  }
  // getdoctorSelected(doctorId: number){
  //   this.doctors.getDoctorInfo(doctorId).subscribe({
  //     next: data => {
  //       this.doctorData = data
  //       this.openModal()
  //     }
  //   })
  // }

    onDoctorClick(doctor: any): void {
      this.doctorData = null
      
    }
    
    onSortChange(event: {field: any, direction: 'asc' | 'desc'}): void {
      console.log('Sort changed:', event);
      // Handle sorting, either client-side or server-side
      this.sortData(event.field, event.direction);
    }
    
    sortData(field: keyof CitasTable, direction: 'asc' | 'desc'): void {
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
