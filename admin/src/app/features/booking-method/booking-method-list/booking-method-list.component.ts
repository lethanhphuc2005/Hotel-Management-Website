import { BookingMethod } from '@/types/booking-method';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-booking-method-list',
  imports: [CommonModule],
  templateUrl: './booking-method-list.component.html',
  styleUrl: './booking-method-list.component.scss'
})
export class BookingMethodListComponent {
  @Input() bookingMethods: BookingMethod[] = [];
  @Input() filter: any;
  @Output() toggleStatus = new EventEmitter();
  @Output() openEdit = new EventEmitter();
}
