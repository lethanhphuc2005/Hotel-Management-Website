import { BookingMethod, BookingMethodFilter } from '@/types/booking-method';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-booking-method-list',
  imports: [CommonModule],
  templateUrl: './booking-method-list.component.html',
  styleUrl: './booking-method-list.component.scss',
})
export class BookingMethodListComponent {
  @Input() bookingMethods!: BookingMethod[];
  @Input() filter: BookingMethodFilter = {
    search: '',
    page: 1,
    limit: 10,
    total: 0,
    status: '',
    sort: 'createdAt',
    order: 'desc',
  };
  @Output() toggleStatus = new EventEmitter<{
    $event: Event;
    method: BookingMethod;
  }>();
  @Output() openEdit = new EventEmitter<BookingMethod>();
}
