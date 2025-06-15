import { Component, OnInit } from '@angular/core';
import { FormComponent } from '../../../shared/components/form/form.component';

import { Patient } from '../../../models/patient';
import { PatientService } from '../../../_core/services/patient.service';
import { AuthService } from '../auth/auth.service';
import { finalize } from 'rxjs';
import { AlertType } from '../../../shared/components/alert/alert.type';
import { CommonService } from '../../../_core/services/common.service';
import { Role } from '../auth/auth-models';
import { doctorFormSchema } from '../../../_core/schemas/doctor-form-schema';
import { DoctorService } from '../../../_core/services/doctor.service';
import { patientFormSchema } from '../../../_core/schemas/patient-form-schema';

@Component({
  selector: 'app-user-profile',
  imports: [FormComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {

  patientFormConfig:any
  patientData!: any
  userId = 0
  role = ""
  readonly alertType = AlertType;
  alert = this.alertType.Info
  showAlert = false
  alertMsg = ""

  constructor(private patientService: PatientService, 
    private doctorService: DoctorService,
    private authService: AuthService,
  public commonService: CommonService,){}

  ngOnInit(): void {
    this.role = this.authService.getRole()

    if(this.role){
      if(this.role.includes(Role.PATIENT)){
        
        this.patientFormConfig = patientFormSchema
        this.getPatient()
      }
      else if(this.role.includes(Role.DOCTOR)){
        this.patientFormConfig = doctorFormSchema
        this.getDoctor()
      }
      else 
        this.patientFormConfig = patientFormSchema
    }
  }

  getDoctor(){
    const userId = this.authService.getUserId()
    this.userId = userId
    console.log(userId)
    if (userId)
      this.doctorService.getDoctorInfo(userId).subscribe({
        next: data => {
          this.patientData = data
          console.log(this.patientData)
        },
        error: e =>{
          this.patientData = new Patient
        }
      })
  }
  getPatient(){
    const userId = this.authService.getUserId()
    this.userId = userId
    console.log(userId)
    if (userId)
      this.patientService.getUserPatientInfo(userId).subscribe({
        next: data => {
          this.patientData = data
          console.log(this.patientData)
        },
        error: e =>{
          this.patientData = new Patient
        }
      })
  }
  createPatient(formData: any){
    const patient = <Patient>formData
    patient.user_id = this.userId
    console.log(patient)
    this.patientService.createPatient(patient).pipe(
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
                this.authService.updateUser(data)
              }
              this.alertMsg = data.message
    
          },error: e => {
            console.log(e)
            this.alert = AlertType.Danger
            this.alertMsg = e.error.message
          }
        })
  }
  // createDoctor(formData: any){
  //   const doctor = <Patient>formData
  //   doctor.user_id = this.userId
  //   console.log(doctor)
  //   this.doctorService.(doctor).pipe(
  //             finalize (() => {
  //               this.commonService.updateAlert({
  //                 message: this.alertMsg,
  //                 alertType: this.alert,
  //                 show: true
  //               })
  //             })
  //           ).subscribe({
  //         next: data => {
  //           console.log(data)
  //             if(data.isError){
  //               this.alert = AlertType.Danger
  //             }else{
  //               this.alert = AlertType.Success
  //               this.authService.updateUser(data)
  //             }
  //             this.alertMsg = data.message
    
  //         },error: e => {
  //           console.log(e)
  //           this.alert = AlertType.Danger
  //           this.alertMsg = e.error.message
  //         }
  //       })
  // }
  

  onFormSubmit(formData: any): void {
    
    if(this.patientData.id == 0)
      this.createPatient(formData)
    console.log('Form submitted:', formData);
    // Process form data here
  }

  onFormCancel(): void {
    console.log('Form cancelled');
    // Handle form cancellation
  }
}
