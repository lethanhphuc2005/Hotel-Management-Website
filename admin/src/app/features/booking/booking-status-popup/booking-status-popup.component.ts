import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoomService } from '@/core/services/room.service';
import { BookingStatusService } from '@/core/services/booking-status.service';
import { Booking } from '@/types/booking';
import { BookingStatus } from '@/types/booking-status';

@Component({
  selector: 'app-booking-status-popup',
  standalone: true,
  templateUrl: './booking-status-popup.component.html',
  styleUrls: ['./booking-status-popup.component.css'],
  imports: [CommonModule, FormsModule],
})
export class BookingStatusPopupComponent implements OnInit {
  @Input() visible = false;
  @Input() booking!: Booking | null;

  @Output() onClose = new EventEmitter();
  @Output() onConfirm = new EventEmitter<any>(); // { detail_id, room_id }[]
  @Output() onCheckIn = new EventEmitter<{
    type: 'CMND' | 'CCCD' | 'Passport';
    number: string;
    representative_name: string;
  }>();
  @Output() onCheckOut = new EventEmitter<string>(); // note
  @Output() onCancel = new EventEmitter<string>(); // cancel reason

  availableRooms: { [key: string]: any[] } = {}; // detail.id -> room[]
  selectedRooms: { [key: string]: string } = {}; // detail.id -> room_id
  statuses: BookingStatus[] = [];

  confirmCancel = false;
  cancelReason = '';
  identityType: 'CMND' | 'CCCD' | 'Passport' = 'CCCD';
  identityNumber = '';
  representativeName = '';

  // Check-out
  checkoutNote = '';

  constructor(
    private roomService: RoomService,
    private bookingStatusService: BookingStatusService
  ) {}

  ngOnInit(): void {
    this.loadBookingStatuses();
  }

  loadBookingStatuses() {
    this.bookingStatusService.getAllBookingStatus({}).subscribe((res) => {
      this.statuses = res.data;

      if (this.booking?.booking_status[0]?.code === 'PENDING') {
        this.booking.booking_details.forEach((detail: any) => {
          this.selectedRooms[detail.id] = '';
          this.loadAvailableRooms(detail);
        });
      }
    });
  }

  loadAvailableRooms(detail: any) {
    if (!this.booking) return;
    const { check_in_date, check_out_date } = this.booking;
    const classId = detail.room_class_id.id;

    this.roomService
      .getAllRooms({
        type: classId,
        check_in_date: new Date(check_in_date).toISOString(),
        check_out_date: new Date(check_out_date).toISOString(),
      })
      .subscribe((res) => {
        this.availableRooms[detail.id] = res.data;
      });
  }

  canConfirm(): boolean {
    if (!this.booking || this.booking.booking_status[0].code !== 'PENDING') {
      return false;
    }
    return this.booking.booking_details.every(
      (detail) => !!this.selectedRooms[detail.id]
    );
  }

  confirmBooking() {
    const roomAssignments = Object.entries(this.selectedRooms).map(
      ([detail_id, room_id]) => ({ detail_id, room_id })
    );
    this.onConfirm.emit(roomAssignments);
  }

  handleCheckIn() {
    if (!this.identityNumber.trim() || !this.representativeName.trim()) return;
    this.onCheckIn.emit({
      type: this.identityType,
      number: this.identityNumber.trim(),
      representative_name: this.representativeName.trim(),
    });
  }

  handleCheckOut() {
    this.onCheckOut.emit(this.checkoutNote.trim());
  }

  handleCancel() {
    if (!this.confirmCancel) {
      this.confirmCancel = true;
    } else if (this.cancelReason.trim()) {
      this.onCancel.emit(this.cancelReason.trim());
    }
  }
}
