import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-booking-status-filter',
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-status-filter.component.html',
  styleUrl: './booking-status-filter.component.scss',
})
export class BookingStatusFilterComponent {
  @Output() filterChange = new EventEmitter();
  @Output() openAdd = new EventEmitter();
  @Input() filter: any;
}
