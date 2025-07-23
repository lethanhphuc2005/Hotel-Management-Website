import { BookingStatus, BookingStatusRequest } from '@/types/booking-status';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-booking-status-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-status-form.component.html',
  styleUrl: './booking-status-form.component.scss',
})
export class BookingStatusFormComponent {
  @Input() bookingStatus: BookingStatusRequest = {};
  @Input() isEdit: boolean = false;
  @Output() submitForm = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
}
