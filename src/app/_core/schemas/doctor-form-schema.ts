import { DocumentType } from "../../models/patient";


export const doctorFormSchema = {
    // Información básica
    id:{
        required: false,
    },
    document_type: {
        label: 'Document Type',
        type: 'select',
        required: true,
        options: [
            { value: 'Cédula', label: 'Cédula'},
            { value: 'Pasaporte', label: 'Pasaporte' },
            { value: 'DNI' , label: 'DNI' },
        ]
    },
    firstname: {
        label: 'First Name',
        required: true,
        minLength: 2
    },
    identity_number: {
        label: 'Identity Number',
        required: true,
        pattern: '^[0-9]{8}$', // Asumiendo que el número de identidad tiene 8 dígitos
        patternError: 'Please enter a valid 8-digit identity number'
    },
    lastname: {
        label: 'Last Name',
        required: true,
        minLength: 2
    },
    tel: {
        label: 'Telephone',
        required: true,
        pattern: '^[0-9]{8}$', // Asumiendo que el teléfono tiene 8 dígitos
        patternError: 'Please enter a valid 8-digit telephone number'
    },


    // Información personal
    informacion_personal: {
        sectionTitle: 'Personal Information',
        address: {
            label: 'Address',
            required: true
        },
        birth_date: {
            label: 'Birth Date',
            type: 'date',
            required: true
        },
        e_civil: {
            label: 'Marital Status',
            type: 'select',
            required: true,
            options: [
                { value: 'Casado', label: 'Casado' },
                { value: 'Soltero', label: 'Soltero' },
                { value: 'Divorciado', label: 'Divorciado' },
                { value: 'Viudo', label: 'Viudo' }
            ]
        },
        gender: {
            label: 'Gender',
            type: 'select',
            required: true,
            options: [
                { value: 'Masculino', label: 'Masculino' },
                { value: 'Femenino', label: 'Femenino' },
                { value: 'Otro', label: 'Otro' }
            ]
        }
    },

    // Información médica
    informacion_profesional: {
        sectionTitle: 'Professional Information',
        hire_date: {
            label: 'Hire Date',
            type: 'date',
            required: false,
            disabled: true
        },
       
    }
};

