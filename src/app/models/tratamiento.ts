export interface Tratamiento {
    diagnostico_id: number;
    diagnostico_descripcion: string;
    diagnostico_fecha_creacion: string; // O puedes usar `Date` si lo conviertes a un objeto Date
    diagnostico_medicamentoId: number;
    observations: string;
    quantity: number;
    medicament_name: string;
    concentration: string;
    dosage: string;
  }