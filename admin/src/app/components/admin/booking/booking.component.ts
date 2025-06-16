import { Component, EventEmitter, Input, NgModule, OnInit, Output } from '@angular/core';
import { BookingService } from '../../../services/booking.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Booking } from '../../../models/booking';
import { BookingStatusService } from '../../../services/booking-status.service';
import { PaymentService } from '../../../services/payment.service';
import { UserService } from '../../../services/user.service';
import { UserRaw } from '../../../models/user';


@Component({
  selector: 'app-booking',
  standalone: true,
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
  imports: [RouterModule, CommonModule, HttpClientModule, FormsModule, FullCalendarModule],
})

export class BookingComponent implements OnInit {
  bookings: Booking[] = [];
  allBookings: Booking[] = [];
  searchText: string = '';
  rooms: any[] = [];             // Toàn bộ danh sách phòng
  filteredRooms: any[] = [];     // Danh sách phòng sau khi lọc
  roomClasses: any[] = [];       // Danh sách loại phòng
  roomStatuses: any[] = [];      // Danh sách trạng thái phòng
  selectedFloor: string = '';         // Giá trị tầng được chọn
  selectedStatus: string = '';        // Giá trị trạng thái được chọn
  selectedRoomClass: string = '';     // Giá trị loại phòng được chọn
  uniqueFloors: number[] = [];        // Danh sách các tầng không trùng
  bookingStatuses: any[] = [];
  paymentStatuses: any[] = [];
  filteredBookings: Booking[] = [];
  filter = {
    status: '',
    check_in_date: '',
    check_out_date: '',
    booking_method: '',
    payment_status: ''
  };
  bookingMethods: any[] = [];

  constructor(private bookingService: BookingService,
    private bookingStatusService: BookingStatusService,
    private paymentService: PaymentService,
    private userService: UserService
  ) { }
  bookingStatusMap: { [key: string]: string } = {};
  userNameMap: { [id: string]: string } = {};

  ngOnInit(): void {
    this.loadBookingStatuses();
    this.getAllBookings();
  }

getUserName(userId: string): void {
  if (this.userNameMap[userId]) return;

  this.userService.getUserById(userId).subscribe({
    next: (res) => {
      const user = res as UserRaw;
      const fullName = `${user.first_name} ${user.last_name}`;
      this.userNameMap[userId] = fullName; // <-- cần thêm dòng này
    },
    error: () => {
      this.userNameMap[userId] = 'Ẩn danh';
    }
  });
}


getAllBookings(): void {
  this.bookingService.getAll().subscribe((res: any) => {
    this.allBookings = Array.isArray(res.data) ? res.data : [];
    this.bookings = [...this.allBookings];
    this.bookings.forEach(booking => {
      if (booking.user_id) {
        this.getUserName(booking.user_id); // ✅ gọi để load tên
      }
    });
    this.filterBookings();
  });
}

  // trạng thái thanh toán
  getPaymentStatuses() {
    this.paymentService.getAllPayments().subscribe({
      next: (res) => this.paymentStatuses = res,
      error: (err) => console.error('Lỗi khi load payment statuses:', err)
    });
  }

  loadBookingStatuses(): void {
    this.bookingStatusService.getAll().subscribe((res: any) => {
      this.bookingStatuses = res;
      this.bookingStatusMap = {};
      for (let status of res) {
        this.bookingStatusMap[status._id] = status.name;
      }
    });
  }

  // lấy tất cả trạng thái
  getAllBookingStatuses(): void {
    this.bookingStatusService.getAll().subscribe((res: any) => {
      this.bookingStatuses = res.data || [];
    });
  }
  // trạng thái đặt phòng
  filterBookings(): void {
    if (!Array.isArray(this.allBookings)) {
      this.bookings = [];
      return;
    }

    const search = this.searchText.trim().toLowerCase();

    this.bookings = this.allBookings.filter(booking => {
      const customerName = booking.customer?.name?.toLowerCase() || '';
      const matchName = customerName.includes(search);

      const bookingStatusId = booking.booking_status?.[0]?._id; // ✅ Lấy _id của trạng thái đầu tiên
      const matchStatus = this.filter.status ? bookingStatusId === this.filter.status : true;

      return matchName && matchStatus;
    });
  }


  // lọc theo ngày
  filterByDate(): void {
    const { check_in_date, check_out_date } = this.filter;
    this.bookings = this.allBookings.filter(booking => {
      const bookingCheckIn = new Date(booking.check_in_date ?? '');
      const bookingCheckOut = new Date(booking.check_out_date ?? '');
      const filterCheckIn = check_in_date ? new Date(check_in_date) : null;
      const filterCheckOut = check_out_date ? new Date(check_out_date) : null;
      const matchCheckIn = filterCheckIn ? bookingCheckIn >= filterCheckIn : true;
      const matchCheckOut = filterCheckOut ? bookingCheckOut <= filterCheckOut : true;
      return matchCheckIn && matchCheckOut;
    });
  }
  // trạng thái phòng
  filterRooms() {
    this.filteredRooms = this.rooms.filter(room => {
      const matchFloor = this.selectedFloor ? room.floor === +this.selectedFloor : true;
      const matchStatus = this.selectedStatus ? room.room_status_id?._id === this.selectedStatus : true;
      const matchRoomClass = this.selectedRoomClass ? room.room_class_id?._id === this.selectedRoomClass : true;
      return matchFloor && matchStatus && matchRoomClass;
    });
  }

  // Mở popup thêm đặt phòng
  openAddPopup(): void {

  }
  // Mở popup sửa với dữ liệu đặt phòng
  editBooking(booking: Booking): void {

  }
  // Mở popup xem chi tiết đặt phòng
  viewBookingDetail(booking: Booking): void {

  }
}

