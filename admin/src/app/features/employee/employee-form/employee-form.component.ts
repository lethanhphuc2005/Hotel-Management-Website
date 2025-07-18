import { Employee } from '@/types/employee';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.scss'
})
export class EmployeeFormComponent {
  @Input() employee: any | null = null;
  @Input() isVisible: boolean = false;
  @Input() isEdit: boolean = false;
  @Output() formSubmit = new EventEmitter();
  @Output() closePopup = new EventEmitter<void>();
}
