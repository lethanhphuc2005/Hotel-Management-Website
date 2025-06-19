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
  searchKeyword: string = '';
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
      console.log('Tất cả đặt phòng:', this.allBookings);
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
    this.bookingStatusService.getAll().subscribe({
      next: (res: any) => {
        const statuses = res.data || res; // Nếu API không có .data thì vẫn fallback

        this.bookingStatuses = statuses;
        this.bookingStatusMap = {};

        for (let status of statuses) {
          this.bookingStatusMap[status._id] = status.name;
        }
      },
      error: (err) => {
        console.error('Lỗi khi load trạng thái booking:', err);
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
//   filterBookings(): void {
//   const keyword = this.searchKeyword.trim().toLowerCase();

//   this.bookings = this.allBookings.filter((booking: any) => {
//     const user = booking.user || {};
//     const room = booking.room_id || {};
//     const request = (booking as any)?.request?.toLowerCase() || '';

//     const fullName = `${user.last_name || ''} ${user.first_name || ''}`.toLowerCase();
//     const email = user.email?.toLowerCase() || '';
//     const phone = user.phone_number || '';
//     const roomName = room.name?.toLowerCase() || '';

//     const matchKeyword =
//       fullName.includes(keyword) ||
//       email.includes(keyword) ||
//       phone.includes(keyword) ||
//       roomName.includes(keyword) ||
//       request.includes(keyword);

//     const bookingStatusId = booking.booking_status?.[0]?._id;
//     const matchStatus = this.filter.status ? bookingStatusId === this.filter.status : true;

//     return matchKeyword && matchStatus;
//   });
// }
filterBookings(): void {
  const keyword = this.searchKeyword.trim().toLowerCase();

  this.bookings = this.allBookings.filter((booking: any) => {
    const fullName = (booking.full_name || '').toLowerCase();
    const matchStatus = this.filter.status
      ? booking.booking_status?.[0]?._id === this.filter.status
      : true;

    return fullName.includes(keyword) && matchStatus;
  });
  console.log('Kết quả tìm kiếm:', this.bookings);
}


onSearch(): void {
  this.filterBookings();
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

