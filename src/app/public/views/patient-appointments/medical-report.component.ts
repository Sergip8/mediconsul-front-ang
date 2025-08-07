import { CommonModule, NgClass, NgFor, NgIf } from "@angular/common";
import { Component, Input } from "@angular/core";
import { Tratamiento } from "../../../models/tratamiento";
import { AppointmentDetail } from "../../../models/cita";
import { PdfExportService } from "../../../_core/services/pdf-export.service";



@Component({
    selector: 'app-medical-report',
    imports: [NgIf, NgClass],
    template: `
<div class="relative">
  <!-- PDF Export Button -->
  <div class="fixed bottom-4 right-4 z-10">
    <button 
      (click)="exportToPdf()" 
      [disabled]="pdfGenerating"
      class="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg transition-colors"
    >
      <span *ngIf="pdfGenerating" class="mr-2">
        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </span>
      <svg *ngIf="!pdfGenerating" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      {{ pdfGenerating ? 'Generando PDF...' : 'Exportar a PDF' }}
    </button>
  </div>

  <!-- Medical Report Content (This will be exported to PDF) -->
  <div id="medical-report" class="bg-white rounded-lg shadow-md overflow-hidden w-full max-w-3xl mx-auto">
    <!-- Report Header -->
    <div class="bg-blue-600 px-6 py-4 text-white">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold">Informe Médico</h1>
          <p class="text-blue-100">Sistema de Consultas Médicas</p>
        </div>
        <div class="text-right">
          <p class="font-semibold">Fecha de impresión:</p>
          <p>{{ formattedCreatedDate }}</p>
        </div>
      </div>
    </div>

    <!-- Doctor Information -->
    <div class="bg-blue-50 px-6 py-4 border-b border-blue-100" *ngIf="appointmentData">
      <h2 class="text-lg font-semibold text-blue-800 mb-3">Información del Doctor</h2>
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-blue-600">Nombre</label>
          <p class="mt-1 text-gray-800">{{ appointmentData.doctor_firstname }} {{ appointmentData.doctor_lastname }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-blue-600">{{ appointmentData.doctor_document_type }}</label>
          <p class="mt-1 text-gray-800">{{ appointmentData.doctor_identity_number }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-blue-600">Teléfono</label>
          <p class="mt-1 text-gray-800">{{ appointmentData.doctor_tel || 'No disponible' }}</p>
        </div>
      </div>
    </div>

    <!-- Appointment Information -->
    <div class="px-6 py-4 border-b border-blue-100" *ngIf="appointmentData">
      <h2 class="text-lg font-semibold text-blue-800 mb-3">Detalles de la Cita</h2>
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-blue-600">Cita #</label>
          <p class="mt-1 text-gray-800">{{ appointmentData.id }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-blue-600">Estado</label>
          <span class="mt-1 inline-block px-3 py-1 text-sm rounded-full" 
                [ngClass]="{
                  'bg-green-100 text-green-800': appointmentData.status === 'Agendada',
                  'bg-blue-100 text-blue-800': appointmentData.status === 'En espera',
                  'bg-red-100 text-red-800': appointmentData.status === 'Cancelada',
                  'bg-gray-100 text-gray-800': appointmentData.status !== 'Agendada' && appointmentData.status !== 'En espera' && appointmentData.status !== 'Cancelada'
                }">
            {{ appointmentData.status }}
          </span>
        </div>
        <div>
          <label class="block text-sm font-medium text-blue-600">Fecha</label>
          <p class="mt-1 text-gray-800">{{ formattedAppointmentDate }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-blue-600">Duración</label>
          <p class="mt-1 text-gray-800">{{ appointmentData.slot }} minutos</p>
        </div>
      </div>
      
      <div class="mt-4">
        <label class="block text-sm font-medium text-blue-600">Descripción</label>
        <p class="mt-1 p-3 bg-blue-50 rounded-md text-gray-700">{{ appointmentData.response }}</p>
      </div>
    </div>

    <!-- Diagnosis Information -->
    <div class="px-6 py-4 border-b border-blue-100" *ngIf="diagnosisData">
      <h2 class="text-lg font-semibold text-blue-800 mb-3">Diagnóstico</h2>
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-blue-600">Diagnóstico #</label>
          <p class="mt-1 text-gray-800">{{ diagnosisData.diagnostico_id }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-blue-600">Fecha</label>
          <p class="mt-1 text-gray-800">{{ formattedDiagnosisDate }}</p>
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-blue-600">Descripción</label>
          <p class="mt-1 text-gray-800">{{ diagnosisData.diagnostico_descripcion }}</p>
        </div>
      </div>
    </div>

    <!-- Medication Information -->
    <div class="px-6 py-4 bg-blue-50" *ngIf="diagnosisData">
      <h2 class="text-lg font-semibold text-blue-800 mb-3">Prescripción Médica</h2>
      
      <div class="bg-white rounded-md p-4 border border-blue-200">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <div class="bg-blue-100 rounded-full p-2 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <span class="text-lg font-semibold text-blue-800">{{ diagnosisData.medicament_name }}</span>
          </div>
          <span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
            {{ diagnosisData.concentration }}
          </span>
        </div>
        
        <div class="grid md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-blue-600">Dosificación</label>
            <p class="mt-1 text-gray-800">{{ diagnosisData.dosage }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-blue-600">quantity</label>
            <p class="mt-1 text-gray-800">{{ diagnosisData.quantity }} unidades</p>
          </div>
        </div>
        
        <div class="mt-4 pt-3 border-t border-blue-100">
          <label class="block text-sm font-medium text-blue-600">observations</label>
          <p class="mt-1 text-gray-700 bg-blue-50 p-3 rounded">{{ diagnosisData.observations }}</p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="px-6 py-4 border-t border-blue-100 text-center">
      <p class="text-gray-600 text-sm">Este documento es un informe médico oficial. Por favor, conserve este documento para sus registros.</p>
    </div>
  </div>
</div>
    `,
    styles: [`
        
    `]
})
export class MedicalReportComponent {
    @Input() diagnosisData: Tratamiento | null = null;
    @Input() appointmentData: AppointmentDetail | null = null;
    
    pdfGenerating = false;
    
    constructor(private pdfExportService: PdfExportService) {}
    
    get formattedDiagnosisDate(): string {
      if (!this.diagnosisData) return '';
      const date = new Date(this.diagnosisData.diagnostico_fecha_creacion);
      return date.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    }
    
    get formattedAppointmentDate(): string {
      if (!this.appointmentData) return '';
      const date = new Date(this.appointmentData.appointment_start_time);
      return date.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    }
    
    get formattedCreatedDate(): string {
      if (!this.appointmentData) return '';
      const date = new Date(this.appointmentData.created_date);
      return date.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    }
    
    async exportToPdf(): Promise<void> {
      this.pdfGenerating = true;
      try {
        const doctorName = `${this.appointmentData?.doctor_firstname} ${this.appointmentData?.doctor_lastname}`;
        const filename = `medical-report-${this.diagnosisData?.diagnostico_id}-${doctorName.replace(/\s+/g, '-')}`;
        
        await this.pdfExportService.generatePdf('medical-report', filename);
      } catch (error) {
        console.error('Error exporting PDF:', error);
      } finally {
        this.pdfGenerating = false;
      }
    }
  }