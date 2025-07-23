import { EmployeeFilter } from '@/types/employee';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-filter',
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-filter.component.html',
  styleUrl: './employee-filter.component.scss',
})
export class EmployeeFilterComponent {
  @Input() filter: EmployeeFilter = {
    search: '',
    page: 1,
    limit: 10,
    total: 0,
    department: '',
    status: '',
    role: '',
    sort: 'createdAt',
    order: 'desc',
    position: '',
  };
  @Output() openAdd = new EventEmitter<void>();
  @Output() filterChange = new EventEmitter<string>();
}
