import { Component } from '@angular/core';
import { UserService } from '../../../_core/services/user.serevice';
import { UserRequest } from '../../../public/views/auth/auth-models';
import { userColumns } from '../../../_core/schemas/user-schemas';
import { PatientTable, SearchParameters } from '../../../models/patient';
import { AlertType } from '../../../shared/components/alert/alert.type';
import { Pagination } from '../../../shared/components/pagination/pagination-model';
import { TableComponent } from '../../../shared/components/table/table.component';

@Component({
  selector: 'app-users',
  imports: [TableComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {

   
      patientData!: UserRequest
      tableData: UserRequest[] = []
      patientColumns = userColumns
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
      usersActiveChange:any[] = []
      
      
      constructor(private userService: UserService){}
    ngOnInit(): void {
      this.getPatients()
    }
      onFormSubmit(formData: any): void {
      
      
        console.log('Form submitted:', formData);
        // Process form data here
      }
    
      onFormCancel(): void {
        console.log('Form cancelled');
        // Handle form cancellation
      }
      getPatients(){
        this.userService.getPagiantedPatients(this.params).subscribe({
          next: data => {
            this.tableData = <UserRequest[]>data.data
            this.pagination.count = data.totalRecords
          }
        })
      }
   
   
  
        onPatientClick(patient: any): void {
          
        }
        
        onSortChange(event: {field: any, direction: 'asc' | 'desc'}): void {
          console.log('Sort changed:', event);
          // Handle sorting, either client-side or server-side
          this.sortData(event.field, event.direction);
        }
        
        sortData(field: keyof UserRequest, direction: 'asc' | 'desc'): void {
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

  onDelete(row: any) {
      console.log(row)
    }
    onEdit(row: any) {
      console.log(row)
    }
    onCheckbox(row: any){
      this.tableData.forEach(u => {
       if(row.id === u.id)
        if(u.is_active == 1 && !row.value)
          this.usersActiveChange.push(row)
      })
      console.log(this.usersActiveChange)
    }

}
