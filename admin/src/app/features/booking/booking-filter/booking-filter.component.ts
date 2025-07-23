import { BookingFilter } from '@/types/booking';
import { BookingMethod } from '@/types/booking-method';
import { BookingStatus } from '@/types/booking-status';
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
  @Input() filter: BookingFilter = {
    search: '',
    sort: 'createdAt',
    order: 'desc',
    page: 1,
    limit: 10,
    total: 0,
    status: '',
    user: '',
    method: '',
    payment_status: '',
    check_in_date: undefined,
    check_out_date: undefined,
    booking_date: undefined,
  };
  @Input() bookingStatuses: BookingStatus[] = [];
  @Input() bookingMethods: BookingMethod[] = [];

  @Output() onFilter = new EventEmitter<void>();
  @Output() onReset = new EventEmitter<void>();
  @Output() onToday = new EventEmitter<void>();
}
