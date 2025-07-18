import { Employee } from '@/types/employee';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
})
export class EmployeeListComponent {
  @Input() employees: Employee[] = [];
  @Output() viewDetail = new EventEmitter<Employee>();
  @Output() toggleStatusChange = new EventEmitter<{
    $event: Event;
    employee: Employee;
  }>();
  @Output() openPopup = new EventEmitter();
}
