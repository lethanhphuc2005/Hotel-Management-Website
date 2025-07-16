import { BookingStatus } from '@/types/booking-status';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-booking-status-list',
  imports: [CommonModule],
  templateUrl: './booking-status-list.component.html',
  styleUrl: './booking-status-list.component.scss',
})
export class BookingStatusListComponent {
  @Input() bookingStatuses: BookingStatus[] = [];
  @Input() filter: any;
  @Output() toggleStatus = new EventEmitter();
  @Output() openEdit = new EventEmitter();
}
