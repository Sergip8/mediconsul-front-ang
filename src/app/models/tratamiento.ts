export interface Tratamiento {
    diagnostico_id: number;
    diagnostico_descripcion: string;
    diagnostico_fecha_creacion: string; // O puedes usar `Date` si lo conviertes a un objeto Date
    diagnostico_medicamentoId: number;
    observaciones: string;
    cantidad: number;
    medicament_name: string;
    concentracion: string;
    dosificacion: string;
  }