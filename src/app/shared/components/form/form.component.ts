import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, ViewChildren, QueryList } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form',
  imports: [NgClass,ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  @Input() formConfig: any = {};
  @Input() formData: any = {};
  @Input() submitButtonText: string = 'Submit';
  @Input() cancelButtonText: string = 'Cancel';
  @Input() showCancelButton: boolean = true;
  @Input() sectionTitle: string = '';
  @Input() nestingLevel: number = 0;
  @Input() hiddenFields: string[] = ['id']; // Lista de campos que no se muestran

  @Output() formSubmit = new EventEmitter<any>();
  @Output() formCancel = new EventEmitter<boolean>();
 
  form: FormGroup;
  fieldKeys: string[] = [];
  nestedObjects: { [key: string]: any } = {};
  formValue: any;
  
  // Para campos de búsqueda
  searchResults: { [key: string]: any[] } = {};
  isSearching: { [key: string]: boolean } = {};
  showSearchResults: { [key: string]: boolean } = {};
  searchTimeouts: { [key: string]: any } = {};
  
  // Field types supported
  fieldTypes = {
    TEXT: 'text',
    NUMBER: 'number',
    EMAIL: 'email',
    PASSWORD: 'password',
    TEXTAREA: 'textarea',
    SELECT: 'select',
    CHECKBOX: 'checkbox',
    RADIO: 'radio',
    DATE: 'date',
    TIME: 'time',
    OBJECT: 'object',
    TEL: 'tel',
    URL: 'url',
    FILE: 'file',
    SEARCH: 'search' // Nuevo tipo
  };

  constructor(private fb: FormBuilder) { 
    this.form = this.fb.group({});
  }
  
  @ViewChildren(FormComponent) nestedForms!: QueryList<FormComponent>;
  
  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.fieldKeys = Object.keys(this.formConfig);
    
    for (const key of this.fieldKeys) {
      const fieldConfig = this.formConfig[key];
      const fieldValue = this.formData && this.formData[key] !== undefined ? this.formData[key] : ""
      console.log(fieldValue)
      
      if (this.isNestedObject(fieldConfig)) {
        this.nestedObjects[key] = {
          config: fieldConfig,
          data: fieldValue
        };
      } else {
        const validators = this.getValidators(fieldConfig);
        if(key !== 'sectionTitle' && !this.hiddenFields.includes(key)) {
          this.form.addControl(key, new FormControl({value: fieldValue, disabled: fieldConfig.disabled }, validators));
          
          // Inicializar propiedades de búsqueda si es un campo search
          if (fieldConfig.type === this.fieldTypes.SEARCH) {
            this.searchResults[key] = [];
            this.isSearching[key] = false;
            this.showSearchResults[key] = false;
            
            // Agregar campo oculto para almacenar el objeto seleccionado completo
            this.form.addControl(key + '_selected', new FormControl(null));
            
            // Suscribirse a cambios en el campo de búsqueda
            this.form.get(key)?.valueChanges.subscribe(value => {
              this.onSearchInputChange(key, value);
            });
          }
        }
      }
    }
  }
  
  // Método para manejar cambios en el input de búsqueda
  onSearchInputChange(fieldKey: string, searchTerm: string): void {
    // Limpiar timeout anterior
    if (this.searchTimeouts[fieldKey]) {
      clearTimeout(this.searchTimeouts[fieldKey]);
    }
    
    // Si el término está vacío, limpiar resultados
    if (!searchTerm || searchTerm.length < 2) {
      this.searchResults[fieldKey] = [];
      this.showSearchResults[fieldKey] = false;
      this.form.get(fieldKey + '_selected')?.setValue(null);
      return;
    }
    
    // Debounce la búsqueda
    this.searchTimeouts[fieldKey] = setTimeout(() => {
      this.performSearch(fieldKey, searchTerm);
    }, 300);
  }
  
  // Realizar la búsqueda usando el callback
  async performSearch(fieldKey: string, searchTerm: string): Promise<void> {
    const fieldConfig = this.formConfig[fieldKey];
    
    if (!fieldConfig.apiCall || typeof fieldConfig.apiCall !== 'function') {
      console.error(`No apiCall function provided for search field: ${fieldKey}`);
      return;
    }
    
    this.isSearching[fieldKey] = true;
    
    try {
      const results = await fieldConfig.apiCall(searchTerm);
      this.searchResults[fieldKey] = Array.isArray(results) ? results : [];
      this.showSearchResults[fieldKey] = true;
    } catch (error) {
      console.error(`Error searching for ${fieldKey}:`, error);
      this.searchResults[fieldKey] = [];
      this.showSearchResults[fieldKey] = false;
    } finally {
      this.isSearching[fieldKey] = false;
    }
  }
  
  // Seleccionar un resultado de búsqueda
  selectSearchResult(fieldKey: string, result: any): void {
    const fieldConfig = this.formConfig[fieldKey];
    
    // Determinar qué propiedad mostrar como texto
    const displayProperty = fieldConfig.displayProperty || 'id';
    const valueProperty = fieldConfig.valueProperty || 'id';
    
    // Establecer el texto mostrado
    this.form.get(fieldKey)?.setValue(result[displayProperty] || result.name || result.label || result.toString());
    
    // Guardar el objeto completo o el valor específico
    this.form.get(fieldKey )?.setValue(result.id);
    
    // Ocultar resultados
    this.showSearchResults[fieldKey] = false;
    this.searchResults[fieldKey] = [];
  }
  
  // Limpiar selección de búsqueda
  clearSearchSelection(fieldKey: string): void {
    this.form.get(fieldKey)?.setValue('');
    this.form.get(fieldKey + '_selected')?.setValue(null);
    this.searchResults[fieldKey] = [];
    this.showSearchResults[fieldKey] = false;
  }
  
  // Obtener el valor seleccionado para un campo de búsqueda
  getSearchSelectedValue(fieldKey: string): any {
    return this.form.get(fieldKey + '_selected')?.value;
  }
  
  isNestedObject(obj: any): boolean {
    if (!this.isObject(obj)) return false;
    
    if (obj.type && Object.values(this.fieldTypes).includes(obj.type)) {
      return false;
    }

    for (const key in obj) {
      if (key === 'sectionTitle' || this.hiddenFields.includes(key)) continue;
     
      const value = obj[key];
      if (this.isObject(value) && (value.label !== undefined || value.type !== undefined)) {
        return true;
      }
    }
    return false;
  }

  getValidators(fieldConfig: any): any[] {
    const validators = [];

    if (fieldConfig.required) {
      validators.push(Validators.required);
    }

    if (fieldConfig.minLength) {
      validators.push(Validators.minLength(fieldConfig.minLength));
    }

    if (fieldConfig.maxLength) {
      validators.push(Validators.maxLength(fieldConfig.maxLength));
    }

    if (fieldConfig.pattern) {
      validators.push(Validators.pattern(fieldConfig.pattern));
    }

    if (fieldConfig.email || fieldConfig.type === this.fieldTypes.EMAIL) {
      validators.push(Validators.email);
    }

    return validators;
  }

  isObject(value: any): boolean {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  getFieldType(key: string): string {
    const fieldConfig = this.formConfig[key];
    
    if (!fieldConfig.type) {
      // Try to infer type from field name if not specified
      if (key.toLowerCase().includes('email')) {
        return this.fieldTypes.EMAIL;
      } else if (key.toLowerCase().includes('password')) {
        return this.fieldTypes.PASSWORD;
      } else if (key.toLowerCase().includes('phone') || key.toLowerCase().includes('tel')) {
        return this.fieldTypes.TEL;
      } else if (key.toLowerCase().includes('date')) {
        return this.fieldTypes.DATE;
      } else if (key.toLowerCase().includes('time')) {
        return this.fieldTypes.TIME;
      } else if (key.toLowerCase().includes('description') || key.toLowerCase().includes('notes')) {
        return this.fieldTypes.TEXTAREA;
      }
      return this.fieldTypes.TEXT;
    }
    
    return fieldConfig.type;
  }

  getFieldLabel(key: string): string {
    const fieldConfig = this.formConfig[key];
    return fieldConfig.label || this.formatLabel(key);
  }

  formatLabel(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  }

  getSectionTitle(key: string): string {
    return this.formConfig[key].sectionTitle || this.formatLabel(key);
  }

  getNestedObjectKeys(): string[] {
    return Object.keys(this.nestedObjects);
  }
  
  private isSubmitting = false; 
  onSubmit(): void {
    console.log("onsubmit ejecutado")
    if (this.isSubmitting) return; 
    this.isSubmitting = true;

    if (this.form.invalid) {
      this.markFormGroupTouched(this.form);
      this.isSubmitting = false;
      return;
    }

    this.nestedForms.forEach((nestedForm) => {
      nestedForm.onSubmit();
    });

    const nestedValues: { [key: string]: any } = {};
    this.nestedForms.forEach((nestedForm, index) => {
      const key = this.getNestedObjectKeys()[index];
      nestedValues[key] = nestedForm.form.value;
    });

    // Procesar campos de búsqueda
    const processedFormValue = { ...this.form.value };
    
    for (const key of this.fieldKeys) {
      const fieldConfig = this.formConfig[key];
      if (fieldConfig.type === this.fieldTypes.SEARCH) {
        const selectedValue = this.getSearchSelectedValue(key);
        if (selectedValue) {
          const valueProperty = fieldConfig.valueProperty || 'id';
          processedFormValue[key] = selectedValue[valueProperty] || selectedValue;
        }
        // Remover el campo auxiliar del resultado final
        delete processedFormValue[key + '_selected'];
      }
    }
   
    this.formValue = { ...processedFormValue, ...nestedValues };
    this.formValue = Object.assign({}, this.formData, this.formValue);
   
    this.formSubmit.emit(this.formValue);
    this.isSubmitting = false; 
  }

  onCancel(): void {
    this.formCancel.emit(this.hasFormChanged());
  }

  handleNestedFormSubmit(key: string, value: any): void {
    console.log('emitio')
    this.nestedObjects[key].submittedValue = value;
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  isFieldInvalid(key: string): boolean {
    const control = this.form.get(key);
    return control ? (control.invalid && (control.dirty || control.touched)) : false;
  }

  getErrorMessage(key: string): string {
    const control = this.form.get(key);
    if (!control || !control.errors) return '';

    if (control.errors['required']) {
      return 'This field is required';
    }
    
    if (control.errors['email']) {
      return 'Please enter a valid email address';
    }
    
    if (control.errors['minlength']) {
      return `Minimum length is ${control.errors['minlength'].requiredLength} characters`;
    }
    
    if (control.errors['maxlength']) {
      return `Maximum length is ${control.errors['maxlength'].requiredLength} characters`;
    }
    
    if (control.errors['pattern']) {
      return this.formConfig[key].patternError || 'Invalid format';
    }
    
    return 'Invalid value';
  }
  
  hasFormChanged(): boolean {
    // Check if main form fields have changed
    for (const key of this.fieldKeys) {
      // Skip nested objects, special fields, and hidden fields
      if (this.nestedObjects[key] || key === 'sectionTitle' || this.hiddenFields.includes(key) || key.endsWith('_selected')) {
        continue;
      }
      
      const control = this.form.get(key);
      if (control) {
        // Compare current value with original value
        const currentValue = control.value;
        const originalValue = this.formData?.[key] !== undefined ? this.formData[key] : '';
        
        // Handle different types of comparisons
        if (typeof currentValue === 'object') {
          // For objects, compare stringified versions
          if (JSON.stringify(currentValue) !== JSON.stringify(originalValue)) {
            return true;
          }
        } else {
          // For primitive types, direct comparison
          // Also handle empty string vs null/undefined cases
          const normalizedCurrent = currentValue === '' ? null : currentValue;
          const normalizedOriginal = originalValue === '' ? null : originalValue;
          
          if (normalizedCurrent !== normalizedOriginal) {
            return true;
          }
        }
      }
    }
    
    // Check if nested forms have changed
    if (this.nestedForms) {
      for (const nestedForm of this.nestedForms.toArray()) {
        if (nestedForm.hasFormChanged()) {
          return true;
        }
      }
    }
    
    // No changes detected
    return false;
  }
}