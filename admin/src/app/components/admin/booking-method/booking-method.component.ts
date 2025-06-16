import { Component, OnInit } from '@angular/core';
import { BookingMethod } from '../../../models/booking-method';
import { BookingMethodService } from '../../../services/booking-method.service';

@Component({
  selector: 'app-booking-method',
  templateUrl: './booking-method.component.html',
  styleUrls: ['./booking-method.component.css']
})

export class BookingMethodComponent implements OnInit {
  bookingMethods: BookingMethod[] = [];

  constructor(private bookingMethodService: BookingMethodService) {}

  ngOnInit(): void {
    this.bookingMethodService.getAll().subscribe({
      next: (data) => {
        this.bookingMethods = data;
        console.log('Booking Methods:', this.bookingMethods);
      },
      error: (err) => {
        console.error('Error loading booking methods', err);
      }
    });
  }
}
