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
  @Input() filter: any;
  @Input() label: string = '';
  @Output() openAdd = new EventEmitter();
  @Output() filterChange = new EventEmitter<any>();
}
