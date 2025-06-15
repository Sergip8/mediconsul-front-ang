import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AppointmentAvaiable } from 'src/app/models/appointment-avaiable';

@Component({
  selector: 'app-doctor-available-list',
  templateUrl: './doctor-available-list.component.html',
  styleUrls: ['./doctor-available-list.component.scss']
})
export class DoctorAvailableListComponent {

  @Input() appmentSelect!: AppointmentAvaiable[] 
  @Output() appmentRes = new EventEmitter<AppointmentAvaiable>()
  flag = false
  time!: Date
  
  constructor(){}

sendSelection(select: AppointmentAvaiable ){
  this.appmentRes.emit(select)
  
  
}

}
