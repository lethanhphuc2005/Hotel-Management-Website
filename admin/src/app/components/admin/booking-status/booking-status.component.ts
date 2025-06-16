import { Component, OnInit } from '@angular/core';
import { BookingStatusService } from '../../../services/booking-status.service';

@Component({
  selector: 'app-booking-status',
  templateUrl: './booking-status.component.html',
  styleUrls: ['./booking-status.component.css']
})
export class BookingStatusComponent implements OnInit {

  bookingStatuses: any[] = [];

  constructor(
    private bookingStatusService: BookingStatusService
  ) { }

  ngOnInit() {
    this.loadBookingStatuses();
  }

  loadBookingStatuses() {
    this.bookingStatusService.getAll().subscribe((data: any[]) => {
      this.bookingStatuses = data;
    });
  }


}
