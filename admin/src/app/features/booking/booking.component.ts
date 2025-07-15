import { Component, OnInit } from '@angular/core';
import { BookingService } from '@/core/services/booking.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Booking } from '@/types/booking';
import { BookingStatusService } from '@/core/services/booking-status.service';
import { BookingMethodService } from '@/core/services/booking-method.service';
import { PaginationComponent } from '@/shared/components/pagination/pagination.component';
import { ToastrService } from 'ngx-toastr';
import { BookingStatus } from '@/types/status';
import { BookingMethod } from '@/types/method';
import { BookingDetailPopupComponent } from '@/shared/components/booking/booking-detail-popup/booking-detail-popup.component';
import { BookingStatusPopupComponent } from '@/shared/components/booking/booking-status-popup/booking-status-popup.component';
import { BookingFilterComponent } from '@/shared/components/booking/booking-filter/booking-filter.component';
import { BookingTableComponent } from '@/shared/components/booking/booking-table/booking-table.component';

@Component({
  selector: 'app-booking',
  standalone: true,
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    FullCalendarModule,
    PaginationComponent,
    BookingDetailPopupComponent,
    BookingStatusPopupComponent,
    BookingFilterComponent,
    BookingTableComponent,
  ],
})
export class BookingComponent implements OnInit {
  bookings: Booking[] = [];
  bookingStatuses: BookingStatus[] = [];
  bookingMethods: BookingMethod[] = [];
  selectedBooking: Booking | null = null;
  isDetailPopupOpen = false;
  isEditPopupOpen = false;
  filter: {
    keyword: string;
    sortField: string;
    sortOrder: 'asc' | 'desc';
    page: number;
    limit: number;
    total: number;
    status: string;
    user: string;
    method: string;
    payment_status?: string;
    check_in_date?: string;
    check_out_date?: string;
    booking_date?: string;
  } = {
    keyword: '',
    sortField: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10,
    total: 0,
    status: '',
    user: '',
    method: '',
    payment_status: '',
    check_in_date: undefined,
    check_out_date: undefined,
    booking_date: undefined,
  };

  constructor(
    private toastr: ToastrService,
    private bookingService: BookingService,
    private bookingStatusService: BookingStatusService,
    private bookingMethodService: BookingMethodService
  ) {}
  ngOnInit(): void {
    this.getAllBookings();
    this.getAllBookingStatuses();
    this.getAllBookingMethods();
  }

  getAllBookings(): void {
    this.bookingService
      .getAllBookings({
        search: this.filter.keyword,
        page: this.filter.page,
        limit: this.filter.limit,
        sort: this.filter.sortField,
        order: this.filter.sortOrder,
        status: this.filter.status,
        user: this.filter.user,
        method: this.filter.method,
        payment_status: this.filter.payment_status,
        check_in_date: this.filter.check_in_date
          ? new Date(this.filter.check_in_date).toISOString()
          : undefined,
        check_out_date: this.filter.check_out_date
          ? new Date(this.filter.check_out_date).toISOString()
          : undefined,
        booking_date: this.filter.booking_date
          ? new Date(this.filter.booking_date).toISOString()
          : undefined,
      })
      .subscribe({
        next: (res) => {
          this.bookings = res.data;
          this.filter.total = res.pagination.total;
        },
        error: (err) => {
          console.error('Error fetching bookings:', err);
          this.toastr.error(err.error.message, 'Lỗi');
          this.bookings = [];
        },
      });
  }

  getAllBookingStatuses(): void {
    this.bookingStatusService.getAll().subscribe({
      next: (res) => {
        this.bookingStatuses = res.data;
      },
      error: (err) => {
        console.error('Error fetching booking statuses:', err);
        this.toastr.error(err.error.message, 'Lỗi');
      },
    });
  }

  getAllBookingMethods(): void {
    this.bookingMethodService.getAll().subscribe({
      next: (res) => {
        this.bookingMethods = res.data;
      },
      error: (err) => {
        console.error('Error fetching booking methods:', err);
        this.toastr.error(err.error.message, 'Lỗi');
      },
    });
  }

  onPageChange(page: number): void {
    this.filter.page = page;
    this.getAllBookings();
  }

  onTodayBookings(): void {
    this.filter.booking_date = new Date().toISOString();
    this.getAllBookings();
    this.toastr.info('Đã lọc đơn đặt phòng hôm nay', 'Thông báo');
  }

  onResetFilter(): void {
    this.filter = {
      keyword: '',
      sortField: 'createdAt',
      sortOrder: 'desc',
      page: 1,
      limit: 10,
      total: 0,
      status: '',
      user: '',
      method: '',
      payment_status: '',
      check_in_date: undefined,
      check_out_date: undefined,
      booking_date: undefined,
    };
    this.getAllBookings();
    this.toastr.info('Đã reset bộ lọc', 'Thông báo');
  }

  onFilterChange(sortField?: string): void {
    if (sortField) {
      this.filter.sortField = sortField;
      this.filter.sortOrder = this.filter.sortOrder === 'asc' ? 'desc' : 'asc'; // Toggle sort order
    }
    console.log('Filter changed:', this.filter);
    this.filter.page = 1; // Reset to first page on filter change
    this.getAllBookings();
    this.toastr.info('Đã cập nhật bộ lọc', 'Thông báo');
  }

  onOpenPopup(isDetail: boolean, item: Booking): void {
    this.isDetailPopupOpen = isDetail;
    this.isEditPopupOpen = !isDetail;

    this.selectedBooking = item;
  }

  onClosePopup(): void {
    this.isDetailPopupOpen = false;
    this.isEditPopupOpen = false;
    this.selectedBooking = null;
  }

  getStatusIdByCode(code: string) {
    const status = this.bookingStatuses.find((s) => s.code === code);
    if (!status) {
      this.toastr.error(`Trạng thái ${code} không hợp lệ`, 'Lỗi');
      return null;
    }
    return status.id;
  }

  handleConfirm(roomAssignments: { detail_id: string; room_id: string }[]) {
    if (!this.selectedBooking) return;

    this.bookingService
      .confirmBooking({
        id: this.selectedBooking.id,
        roomAssignments,
      })
      .subscribe({
        next: () => {
          this.toastr.success('Đã xác nhận và gán phòng', 'Thành công');
          this.getAllBookings();
          this.selectedBooking = null;
          this.isEditPopupOpen = false;
        },
        error: (err) => {
          this.toastr.error(err?.error?.message || 'Lỗi xác nhận', 'Lỗi');
        },
      });
  }

  handleCancel(reason: string) {
    if (!this.selectedBooking) return;

    this.bookingService
      .cancelBooking({ id: this.selectedBooking.id, reason })
      .subscribe({
        next: () => {
          this.toastr.success('Đã hủy đơn đặt phòng', 'Thành công');
          this.getAllBookings();
          this.isEditPopupOpen = false;
          this.selectedBooking = null;
        },
        error: (err) => {
          this.toastr.error(err?.error?.message || 'Lỗi khi hủy đơn', 'Lỗi');
        },
      });
  }

  handleCheckIn(identity: {
    type: 'CMND' | 'CCCD' | 'Passport';
    number: string;
    representative_name: string;
  }) {
    if (!this.selectedBooking) return;

    if (!identity.number || !identity.representative_name) {
      this.toastr.error(
        'Vui lòng nhập đầy đủ thông tin CMND/CCCD và tên người nhận phòng'
      );
      return;
    }

    this.bookingService
      .checkInBooking({ id: this.selectedBooking.id, identity })
      .subscribe({
        next: () => {
          this.toastr.success('Khách đã nhận phòng', 'Thành công');
          this.getAllBookings();
          this.isEditPopupOpen = false;
          this.selectedBooking = null;
        },
        error: (err) => {
          this.toastr.error(err?.error?.message || 'Lỗi khi check-in', 'Lỗi');
        },
      });
  }

  handleCheckOut(note: string = '') {
    if (!this.selectedBooking) return;

    this.bookingService
      .checkOutBooking({ id: this.selectedBooking.id, note })
      .subscribe({
        next: () => {
          this.toastr.success('Khách đã trả phòng', 'Thành công');
          this.getAllBookings();
          this.isEditPopupOpen = false;
          this.selectedBooking = null;
        },
        error: (err) => {
          this.toastr.error(err?.error?.message || 'Lỗi khi check-out', 'Lỗi');
        },
      });
  }
}
