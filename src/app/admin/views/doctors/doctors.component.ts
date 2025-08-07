import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { InformacionPersonal, SearchParameters } from '../../../models/patient';
import { AlertType } from '../../../shared/components/alert/alert.type';
import { doctorColumns, doctorFormSchema } from '../../../_core/schemas/doctor-form-schema';
import { Doctor, DoctorTable, InformacionProfesional } from '../../../models/doctor';
import { TableColumn, TableComponent } from '../../../shared/components/table/table.component';
import { Pagination } from '../../../shared/components/pagination/pagination-model';
import { FormComponent } from '../../../shared/components/form/form.component';
import { DoctorService } from '../../../_core/services/doctor.service';
import { CommonService } from '../../../_core/services/common.service';
import { PersonalInfoService } from '../../../_core/services/personal-info.service';
import { ProfessionalInfoService } from '../../../_core/services/professional-info.service';
import { UserService } from '../../../_core/services/user.service';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { LoadingComponent } from '../../../shared/components/loading/loading';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-doctors',
  imports: [FormComponent, TableComponent, ModalComponent, LoadingComponent, NgIf],
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css']
})
export class DoctorsComponent implements OnInit {

  doctorFormConfig!: any;
  doctorData!: Doctor | null;
  tableData: DoctorTable[] = [];
  doctorColumns = doctorColumns;
  userId = 0;
  role = "";
  readonly alertType = AlertType;
  alert = this.alertType.Info;
  showAlert = false;
  alertMsg = "";
  params = new SearchParameters();
  loading = false;
  pagination: Pagination = {
    count: 5,
    page: 1,
    size: 10
  };
  isEqual = true;
  isChange = false;
  showUnsaveChangesAlert = false;
  isModalOpen = false;
  modalTitle = 'Doctor';

  @ViewChildren(FormComponent) form!: QueryList<FormComponent>;

  constructor(
    private doctor: DoctorService,
    private commonService: CommonService,
    private personalInfoService: PersonalInfoService,
    private professionalInfoService: ProfessionalInfoService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getDoctors();
  }

  onFormSubmit(formData: any): void {
    let detectChanges = false;
    console.log(this.doctorData);
    console.log(formData);
    
    let professionalInfo = formData.informacion_profesional;
    let personalInfo = formData.informacion_personal;
    
    if (this.doctorData) {
      professionalInfo = { id: this.doctorData?.informacion_profesional.id, ...formData.informacion_profesional };
      personalInfo = { id: this.doctorData?.informacion_personal.id, ...formData.informacion_personal };
      
      if (this.hasChanges(this.doctorData?.informacion_personal, personalInfo)) {
        detectChanges = true;
        this.updateInformacionPersonal(personalInfo);
      }
      
      if (this.hasChanges(this.doctorData?.informacion_profesional, professionalInfo)) {
        detectChanges = true;
        this.updateInformacionProfesional(professionalInfo);
      }
      
      const mainFieldsChanged = this.hasChanges(
        this.excludeNested(this.doctorData), 
        this.excludeNested(formData)
      );
      
      if (mainFieldsChanged) {
        detectChanges = true;
        this.updateMainData(this.excludeNested(formData));
      }
      
      if (!detectChanges) {
        this.closeModal();
        this.commonService.updateAlert({
          message: 'No se realizaron cambios',
          alertType: AlertType.Warning,
          show: true
        });
      }
    } else {
      this.createDoctor(formData);
    }
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
        if (this.doctorData) {
          this.doctorData.informacion_personal = { ...currentData };
        }
        this.isModalOpen = false;
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

  updateInformacionProfesional(currentData: InformacionProfesional): void {
    this.professionalInfoService.updateProfessionalInfo(currentData).pipe(
      finalize(() => {
        this.commonService.updateAlert({
          message: 'Información profesional actualizada.',
          alertType: AlertType.Success,
          show: true
        });
      })
    ).subscribe({
      next: (data) => {
        if (this.doctorData) {
          this.doctorData.informacion_profesional = { ...currentData };
        }
        this.isModalOpen = false;
      },
      error: (err) => {
        this.commonService.updateAlert({
          message: 'Error al actualizar información profesional.',
          alertType: AlertType.Danger,
          show: true
        });
      }
    });
  }

  updateMainData(currentData: any): void {
    this.doctor.updateDoctorData(currentData).pipe(
      finalize(() => {
        this.commonService.updateAlert({
          message: 'Datos principales actualizados.',
          alertType: AlertType.Success,
          show: true
        });
      })
    ).subscribe({
      next: (data) => {
        if (this.doctorData) {
          Object.assign(this.doctorData, currentData);
          this.isModalOpen = false;
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
    const { informacion_personal, informacion_profesional, ...mainData } = data;
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
    
  getDoctors() {
    this.doctor.getPaginatedDoctors(this.params).subscribe({
      next: data => {
        console.log(data);
        this.tableData = data.data;
        this.pagination.count = data.totalRecords;
        console.log(this.tableData);
      }
    });
  }

  getDoctorSelected(doctorId: number) {
    this.doctor.getDoctorInfo(doctorId).pipe(finalize(() => this.loading = false)).subscribe({
      next: data => {
        console.log(data);
        this.doctorData = data;
        this.openModal();
      }
    });
  }

  onDoctorClick(doctor: any): void {
    this.doctorData = null;
    this.doctorFormConfig = doctorFormSchema((term) => this.userService.getUserFormData(term));
    this.getDoctorSelected(doctor.id);
  }
  
  onSortChange(event: {field: any, direction: 'asc' | 'desc'}): void {
    console.log('Sort changed:', event);
    this.sortData(event.field, event.direction);
  }
  
  sortData(field: keyof DoctorTable, direction: 'asc' | 'desc'): void {
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

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal() {
    console.log("close modal parent");
    this.form.forEach((f) => {
      f.onCancel();
    });
  }

  compareObjects(object1: any, object2: any) {
    const keys = Object.keys(object1);

    keys.forEach(k => {
      if (typeof object1[k] === 'object') {
        this.compareObjects(object1[k], object2[k]);
        return;
      }

      if (object1[k] != object2[k]) {
        if (!k.endsWith("id")) {
          console.log(object1[k]);
          this.isEqual = false;
        }
      }
    });
  }

  createDoctor(formData: any) {
    const doctor = <Doctor>formData;
    console.log(doctor);
    this.doctor.createDoctor(doctor).pipe(
      finalize(() => {
        this.commonService.updateAlert({
          message: this.alertMsg,
          alertType: this.alert,
          show: true
        });
      })
    ).subscribe({
      next: data => {
        this.isModalOpen = false;
        console.log(data);
        if (data.isError) {
          this.alert = AlertType.Danger;
        } else {
          this.alert = AlertType.Success;
        }
        this.alertMsg = data.message;
      },
      error: e => {
        console.log(e);
        this.alert = AlertType.Danger;
        this.alertMsg = e.error.message;
      }
    });
  }

  onCreate() {
    this.doctorData = null;
    this.doctorFormConfig = doctorFormSchema((term) => this.userService.getUserFormData(term), false);
    this.openModal();
  }
}