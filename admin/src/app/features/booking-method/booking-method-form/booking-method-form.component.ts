import { BookingMethod, BookingMethodRequest } from '@/types/booking-method';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-booking-method-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-method-form.component.html',
  styleUrl: './booking-method-form.component.scss',
})
export class BookingMethodFormComponent {
  @Input() bookingMethod: BookingMethodRequest = {};
  @Input() isEdit: boolean = false;
  @Output() submitForm = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
}
