import { TableColumn } from "../../shared/components/table/table.component";

export interface PatientFormCallbacks {
  buscarUsuario: (searchTerm: string) => Promise<any[]>;
}

export function patientFormSchema(buscarUsuario: (searchTerm: string) => Promise<any[]>, isEditMode = true) {
return{
  // Información básica
    user_id: {
          apiCall: buscarUsuario, // ← Aquí usamos el callback
          type: "search",
          label: 'Usuario',
          required: !isEditMode
        },
  id: {
    required: false,
    defaultValue: null
  },
  document_type: {
    label: 'Document Type',
    type: 'select',
    required: true,
    defaultValue: 'ID_Card',
    options: [
      { value: 'ID_Card', label: 'Cédula'},
      { value: 'TI', label: 'Tarjeta de identidad'},
      { value: 'Passport', label: 'Pasaporte' },
      { value: 'DNI' , label: 'DNI' },
    ]
  },
  firstname: {
    label: 'First Name',
    required: true,
    minLength: 2,
    defaultValue: ''
  },
  identity_number: {
    label: 'Identity Number',
    required: true,
    pattern: '^[0-9]{8}$', // Asumiendo que el número de identidad tiene 8 dígitos
    patternError: 'Please enter a valid 8-digit identity number',
    defaultValue: ''
  },
  lastname: {
    label: 'Last Name',
    required: true,
    minLength: 2,
    defaultValue: ''
  },
  phone: {
    label: 'Telephone',
    required: true,
    patternError: 'Please enter a valid 8-digit telephone number',
    defaultValue: ''
  },

  // Información personal
  informacion_personal: {
      sectionTitle: 'Personal Information',
     id: {
      label: "ID",
      defaultValue: null
    },
   
    address: {
      label: 'Address',
      required: true,
      defaultValue: ''
    },
    birth_date: {
      label: 'Birth Date',
      type: 'date',
      required: true,
      defaultValue: Date.now().toLocaleString()
    },
    marital_status: {
      label: 'Estado Civil',
      type: 'select',
      required: true,
      defaultValue: 'Single',
      options: [
        { value: 'Married', label: 'Casado' },
        { value: 'Single', label: 'Soltero' },
        { value: 'Divorced', label: 'Divorciado' },
      ]
    },
    gender: {
      label: 'Genero',
      type: 'select',
      required: true,
      defaultValue: '',
      options: [
        { value: 'Male', label: 'Masculino' },
        { value: 'Female', label: 'Femenino' },
      ]
    }
  },

  informacion_medica: {
    sectionTitle: "Información Médica",
    id: {
      label: "ID",
      defaultValue: null
    },
    blood_type: {
      label: "Tipo de Sangre",
      type: "select",
      defaultValue: 'A+',
      options: [
        { value: "A+", label: "A+" },
        { value: "A-", label: "A-" },
        { value: "B+", label: "B+" },
        { value: "B-", label: "B-" },
        { value: "AB+", label: "AB+" },
        { value: "AB-", label: "AB-" },
        { value: "O+", label: "O+" },
        { value: "O-", label: "O-" }
      ]
    },
    height: {
      label: "Altura",
      type: "number",
      unit: "cm",
      defaultValue: null
    },
    weight: {
      label: "Peso",
      type: "number",
      unit: "kg",
      defaultValue: null
    }
  }
}

}
export const patientColumns: TableColumn[] = [
  
    { header: 'Nombre', field: 'firstName', type: 'text', sortable: true, width: 'w-2/12' },
    { header: 'Apellido', field: 'lastName', type: 'text',sortable: false, width: 'w-2/12' },
    { header: 'Tipo de documento', field: 'document_type', type: 'text',sortable: true, width: 'w-2/12' },
    { header: 'Numero documento', field: 'identity_number', type: 'text', sortable: true, width: 'w-2/12' },

  ];