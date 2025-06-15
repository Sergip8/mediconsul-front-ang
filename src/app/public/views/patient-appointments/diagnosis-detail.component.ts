import { NgFor, NgIf } from "@angular/common";
import { Component, Input } from "@angular/core";
import { Tratamiento } from "../../../models/tratamiento";


@Component({
    selector: 'app-diagnosis-detail',
    imports: [NgFor, NgIf],
    template: `
   <div class="bg-white rounded-lg shadow-md overflow-hidden w-full max-w-2xl" *ngIf="diagnosisData">
  <!-- Header -->
  <div class="bg-blue-100 border-b border-blue-200 px-6 py-4">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold text-blue-800">
        Diagnóstico #{{ diagnosisData.diagnostico_id }}
      </h2>
      <span class="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
        {{ formattedDate }}
      </span>
    </div>
  </div>

  <!-- Diagnosis Information -->
  <div class="px-6 py-4 border-b border-blue-100">
    <h3 class="text-lg font-medium text-blue-900 mb-2">Información del Diagnóstico</h3>
    <div class="grid md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-blue-600">Descripción</label>
        <p class="mt-1 text-gray-800">{{ diagnosisData.diagnostico_descripcion }}</p>
      </div>
      <div>
        <label class="block text-sm font-medium text-blue-600">ID</label>
        <p class="mt-1 text-gray-800">{{ diagnosisData.diagnostico_id }}</p>
      </div>
    </div>
  </div>

  <!-- Medication Information -->
  <div class="px-6 py-4 bg-blue-50">
    <h3 class="text-lg font-medium text-blue-900 mb-4">Medicamento Prescrito</h3>
    
    <div class="bg-white rounded-md p-4 border border-blue-200 mb-4">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center">
          <div class="bg-blue-100 rounded-full p-2 mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <span class="text-lg font-semibold text-blue-800">{{ diagnosisData.medicament_name }}</span>
        </div>
        <span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
          {{ diagnosisData.concentracion }}
        </span>
      </div>
      
      <div class="grid md:grid-cols-3 gap-4 mt-4">
        <div>
          <label class="block text-sm font-medium text-blue-600">Dosificación</label>
          <p class="mt-1 text-gray-800">{{ diagnosisData.dosificacion }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-blue-600">Cantidad</label>
          <p class="mt-1 text-gray-800">{{ diagnosisData.cantidad }} unidades</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-blue-600">ID Medicamento</label>
          <p class="mt-1 text-gray-800">{{ diagnosisData.diagnostico_medicamentoId || 'N/A' }}</p>
        </div>
      </div>
      
      <div class="mt-4 pt-3 border-t border-blue-100">
        <label class="block text-sm font-medium text-blue-600">Observaciones</label>
        <p class="mt-1 text-gray-700 bg-blue-50 p-2 rounded">{{ diagnosisData.observaciones }}</p>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div class="px-6 py-3 bg-gray-50 border-t border-blue-100 flex justify-end">
    <button class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mr-2">
      Imprimir
    </button>
    <button class="px-4 py-2 border border-blue-300 text-blue-700 rounded-md hover:bg-blue-50 transition-colors">
      Editar
    </button>
    <div class="">
        <ng-content></ng-content>

    </div>
  </div>
</div>
    `,
    styles: [`
        
    `]
})
export class DiagnosisDetailComponent {

    constructor(){
  }
  @Input() diagnosisData: Tratamiento | null = null;
  
  get formattedDate(): string {
    if (!this.diagnosisData) return '';
    const date = new Date(this.diagnosisData.diagnostico_fecha_creacion);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}