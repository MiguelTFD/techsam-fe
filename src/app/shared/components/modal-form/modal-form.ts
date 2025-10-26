import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FormField {
  key: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'date' | 'checkbox';
  required?: boolean;
  placeholder?: string;
  options?: { value: any; label: string }[];
  // Agregar propiedades de validación
  min?: number;
  max?: number;
  step?: number;
  pattern?: string;
  disabled?: boolean;
  hidden?: boolean;
}

@Component({
  selector: 'app-modal-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-form.html',
  styleUrls: ['./modal-form.scss']
})
export class ModalForm {
  @Input() title: string = 'Formulario';
  @Input() fields: FormField[] = [];
  @Input() show: boolean = false;
  @Input() loading: boolean = false;
  
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  formData: any = {};

  ngOnChanges() {
    if (this.show) {
      // Inicializar formData con valores vacíos
      this.formData = {};
      this.fields.forEach(field => {
        this.formData[field.key] = '';
      });
    }
  }

  onSave() {
    // Validar campos requeridos
    const invalidFields = this.fields.filter(field => 
      field.required && !this.formData[field.key]
    );

    if (invalidFields.length > 0) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    this.save.emit(this.formData);
  }

  onCancel() {
    this.cancel.emit();
  }

  trackByField(index: number, field: FormField): string {
    return field.key;
  }
}