import { DocumentType } from "../../models/patient";
import { TableColumn } from "../../shared/components/table/table.component";

export function doctorFormSchema(buscarUsuario: (searchTerm: string) => Promise<any[]>, isEditMode = true) {
    return {
        // Información básica
        user_id: {
            apiCall: buscarUsuario,
            type: "search",
            label: 'Usuario',
            required: !isEditMode
        },
        
        id: {
            required: false,
        },
        
        document_type: {
            label: 'Tipo de Documento',
            type: 'select',
            required: true,
            options: [
                 { value: 'ID_Card', label: 'Cédula'},
      { value: 'TI', label: 'Tarjeta de identidad'},
      { value: 'Passport', label: 'Pasaporte' },
      { value: 'DNI' , label: 'DNI' }
    
            ]
        },
        
        firstname: {
            label: 'Nombre',
            required: true,
            minLength: 2
        },
        
        identity_number: {
            label: 'Número de Documento',
            required: true,
            pattern: '^[0-9]{8}$',
            patternError: 'Por favor ingrese un número de documento válido de 8 dígitos'
        },
        
        lastname: {
            label: 'Apellido',
            required: true,
            minLength: 2
        },
        
        phone: {
            label: 'Teléfono',
            required: true,
            pattern: '^[0-9]{8}$',
            patternError: 'Por favor ingrese un número de teléfono válido de 8 dígitos'
        },

        // Información personal
        informacion_personal: {
            sectionTitle: 'Información Personal',
            address: {
                label: 'Dirección',
                required: true
            },
            birth_date: {
                label: 'Fecha de Nacimiento',
                type: 'date',
                required: true
            },
            marital_status: {
                label: 'Estado Civil',
                type: 'select',
                required: true,
                options: [
       { value: 'Married', label: 'Casado' },
        { value: 'Single', label: 'Soltero' },
        { value: 'Divorced', label: 'Divorciado' },
                ]
            },
            gender: {
                label: 'Género',
                type: 'select',
                required: true,
                options: [
           { value: 'Male', label: 'Masculino' },
        { value: 'Female', label: 'Femenino' },
                ]
            }
        },

        // Información profesional
        informacion_profesional: {
            sectionTitle: 'Información Profesional',
            hire_date: {
                label: 'Fecha de Contratación',
                type: 'date',
                required: false,
                disabled: true
            },
            professional_number: {
                label: 'Número Profesional',
                required: true,
                pattern: '^[0-9]{8}$',
                patternError: 'Por favor ingrese un número profesional válido de 8 dígitos'
            },
            work_shift: {
                label: 'Turno de Trabajo',
                type: 'select',
                required: true,
                options: [
                    { value: 'AM', label: 'Mañana' },
                    { value: 'PM', label: 'Tarde' },
             
                ]
            },
            specialization: {
                label: 'Especialización',
                type: 'number',
                required: true
            },
            consultorios_id: {
                label: 'Consultorio',
                type: 'number',
                required: true
            }
        }
    };
}

export const doctorColumns: TableColumn[] = [        { header: 'Nombre', field: 'firstName', type: 'text', sortable: true, width: 'w-2/12' },     { header: 'Apellido', field: 'lastName', type: 'text',sortable: false, width: 'w-2/12' },     { header: 'Tipo de documento', field: 'document_type', type: 'text',sortable: true, width: 'w-2/12' },     { header: 'Numero documento', field: 'identity_number', type: 'text', sortable: true, width: 'w-2/12' },    ];

