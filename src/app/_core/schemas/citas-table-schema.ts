import { TableColumn } from "../../shared/components/table/table.component";

export const citaColumns: TableColumn[] = [
    { header: 'Cita ID', field: 'id', sortable: true, width: 'w-1/12' },
    { header: 'Fecha cita', field: 'appointment_start_time', type: 'date', sortable: true, width: 'w-2/12' },
    { header: 'Datos Cita', field: 'response', sortable: false, width: 'w-2/6' },
    { header: 'Especialidad', field: 'type', sortable: true, width: 'w-2/12' },
    { header: 'Status', field: 'state', type: 'status', sortable: true, width: 'w-2/12' },

  ];
  

  export const especialidades = {
    '20': 'Anestesiología',
    '4': 'Cardiología',
    '18': 'Cirugía General',
    '5': 'Dermatología',
    '12': 'Endocrinología',
    '13': 'Gastroenterología',
    '3': 'Ginecología y Obstetricia',
    '1': 'Medicina General',
    '19': 'Medicina Interna',
    '16': 'Nefrología',
    '14': 'Neumología',
    '8': 'Neurología',
    '6': 'Oftalmología',
    '17': 'Oncología',
    '7': 'Otorrinolaringología',
    '2': 'Pediatría',
    '9': 'Psiquiatría',
    '15': 'Reumatología',
    '10': 'Traumatología y Ortopedia',
    '11': 'Urología'
  };