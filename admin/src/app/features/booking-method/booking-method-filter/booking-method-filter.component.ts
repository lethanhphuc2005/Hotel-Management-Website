import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-booking-method-filter',
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-method-filter.component.html',
  styleUrl: './booking-method-filter.component.scss',
})
export class BookingMethodFilterComponent {
  @Output() filterChange = new EventEmitter();
  @Output() openAdd = new EventEmitter();
  @Input() filter: any;
}
