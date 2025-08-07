import { Component } from '@angular/core';
import { ChatbotComponent } from '../../../shared/components/chatbot/chatbot.component';
import { ServiceUnavailableComponent } from '../unavailable/unavailable.component';
import { NgFor, NgIf } from '@angular/common';
import { ChatService } from '../../../_core/services/chat.service';
import { AuthService } from '../auth/auth.service';
import { ChatResponse } from '../../../models/chat';
import { DayInfo } from '../../../shared/components/doctor-availability/doctor-availability-header';
import { DoctorAvailabilityInfo } from '../../../models/doctor';
import { AppointmentSelection, DoctorAvailabilityComponent } from "../../../shared/components/doctor-availability/doctor-availability.component";
import { DoctorCardComponent } from "../../../shared/components/doctor-card/doctor-card.component";
import { CreateCita } from '../../../models/cita';


export interface ChatMessage {
  content: string;
  role: "user"| "assistant";
  timestamp: Date;
}

@Component({
  selector: 'app-chat-feature',
  standalone: true,
  imports: [ChatbotComponent, ServiceUnavailableComponent, NgIf, DoctorAvailabilityComponent, NgFor, DoctorCardComponent],
  template: `
    <div class="h-fit p-4 ">
      <ng-container *ngIf="isServiceAvailable; else serviceUnavailable">
        <app-chatbot
          [messages]="messages"
          [isTyping]="isTyping"
          [isDisabled]="isTyping"
          (onSendMessage)="handleSendMessage($event)"
        ></app-chatbot>
        <div *ngIf="doctors && doctors.length>0" class="flex my-5 gap-2 w-full overflow-x-scroll">
          <div *ngFor="let d of doctors">
            <app-doctor-availability
            [startHour]="startHour"
            [endHour]="endHour"
                          [doctor]="{doctorId:d.id, spe: speId}"
                          [visibleDays]="days"
                          [existingAppointments]="d.citas"
                          (slotSelected)="onSlotSelected($event)"
                        >
                      <app-doctor-card [doctor]="d"></app-doctor-card>
                      </app-doctor-availability>

          </div>
          <div *ngIf="">

          </div>

        </div>

      </ng-container>
      
      <ng-template #serviceUnavailable>
        <app-service-unavailable
          title="Chat Service Unavailable"
          message="Our chat service is currently down. Please try again later."
          [showRetryButton]="true"
          retryButtonText="Retry Connection"
          (onRetry)="checkServiceAvailability()"
        ></app-service-unavailable>
      </ng-template>
    </div>
  `
})
export class ChatFeatureComponent {
  isServiceAvailable = true;
  isTyping = false;
  messages: ChatMessage[] = [
    {
      content: "Hola en que puedo ayudarte hoy?",
      role: "assistant",
      timestamp: new Date()
    }
  ];
  userId = 0
  days: DayInfo[] = []
  doctors:DoctorAvailabilityInfo[] = []
  dates:Date[] = []
  speId = 0
  startHour = 8
  endHour = 12
  
  constructor(private chatService: ChatService, private authService: AuthService, ){
    const id = authService.getUserId()
    if(id)
        this.userId = id
  }
  
  handleSendMessage(content: string) {
    
    this.messages.push({
      content,
      role: "user",
      timestamp: new Date()
    });
    const chat: ChatResponse = {
        message: content,
        conversationHistory: this.messages,
        userId: this.userId
    }
    console.log(chat)
    this.getChatResponse(chat)
    
    // Simulate bot typing
    this.isTyping = true;
    
    // Simulate bot response after delay
 
  }
  
  checkServiceAvailability() {
    // Logic to check if service is available
    console.log('Checking chat service availability...');
    // In a real app, you'd likely make an HTTP request here
    this.isServiceAvailable = true;
  }
  getChatResponse(chat: ChatResponse){
    this.days = []
    this.chatService.getResponse(chat).subscribe({
        next: data => {
          console.log(data)
          const doc = data.DoctorAvailability
            this.isTyping = false;
            this.messages.push({
                content: data.reply,
                role: "assistant",
                timestamp: new Date()
              });
              if(data.complete){
              if(doc){
                 
                    this.isServiceAvailable = true
                  
                this.speId = doc.SpeId           
                this.dates = doc.DateRange
                const date = new Date (this.dates[0])
                this.startHour = new Date(this.dates[0]).getHours()
                this.endHour = new Date(this.dates[1]).getHours()

               
                this.days.push({
                  id: 1,
                  date: date,
                  dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
                  dayNumber: date.getDate(),
                  month: date.toLocaleDateString('en-US', { month: 'short' })
                });
                this.doctors = doc.Doctores
                console.log(this.doctors)
              }
              else{
                console.log(doc)
              
            }
            }
        }
    })
  }
    onSlotSelected(selection: CreateCita): void {
      console.log(selection)
    }
}