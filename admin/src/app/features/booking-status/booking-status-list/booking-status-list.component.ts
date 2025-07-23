import { BookingStatus, BookingStatusFilter } from '@/types/booking-status';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-booking-status-list',
  imports: [CommonModule],
  templateUrl: './booking-status-list.component.html',
  styleUrl: './booking-status-list.component.scss',
})
export class BookingStatusListComponent {
  @Input() bookingStatuses!: BookingStatus[];
  @Input() filter: BookingStatusFilter = {
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
    status: BookingStatus;
  }>();
  @Output() openEdit = new EventEmitter<BookingStatus>();
}
