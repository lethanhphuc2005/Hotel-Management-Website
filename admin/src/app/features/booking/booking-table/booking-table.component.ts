import { BookingPaymentLabelPipe } from '@/shared/pipes/booking-payment-label.pipe';
import { BookingStatusLabelPipe } from '@/shared/pipes/booking-status-label.pipe';
import { Booking } from '@/types/booking';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-booking-table',
  standalone: true,
  templateUrl: './booking-table.component.html',
  styleUrls: ['./booking-table.component.scss'],
  imports: [CommonModule, BookingStatusLabelPipe, BookingPaymentLabelPipe],
})
export class BookingTableComponent {
  @Input() bookings: Booking[] = [];
  @Output() onEdit = new EventEmitter<any>();
  @Output() onViewDetail = new EventEmitter<any>();
}
