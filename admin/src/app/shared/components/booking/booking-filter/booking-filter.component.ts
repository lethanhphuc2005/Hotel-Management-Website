import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-booking-filter',
  standalone: true,
  templateUrl: './booking-filter.component.html',
  styleUrls: ['./booking-filter.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class BookingFilterComponent {
  @Input() filter: any;
  @Input() bookingStatuses: any[] = [];
  @Input() bookingMethods: any[] = [];

  @Output() onFilter = new EventEmitter<void>();
  @Output() onReset = new EventEmitter<void>();
  @Output() onToday = new EventEmitter<void>();
}
