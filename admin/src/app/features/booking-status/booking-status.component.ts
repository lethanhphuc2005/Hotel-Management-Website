import { Component, OnInit } from '@angular/core';
import { BookingStatusService } from '@/core/services/booking-status.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  BookingStatus,
  BookingStatusFilter,
  BookingStatusRequest,
} from '@/types/booking-status';
import { ToastrService } from 'ngx-toastr';
import { PaginationComponent } from '@/shared/components/pagination/pagination.component';
import { BookingStatusListComponent } from '@/features/booking-status/booking-status-list/booking-status-list.component';
import { BookingStatusFormComponent } from '@/features/booking-status/booking-status-form/booking-status-form.component';
import { CommonFilterBarComponent } from '@/shared/components/common-filter-bar/common-filter-bar.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-booking-status',
  standalone: true,
  templateUrl: './booking-status.component.html',
  styleUrls: ['./booking-status.component.scss'],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    PaginationComponent,
    BookingStatusListComponent,
    BookingStatusFormComponent,
    CommonFilterBarComponent,
  ],
})
export class BookingStatusComponent implements OnInit {
  bookingStatuses: BookingStatus[] = [];
  selectedBookingStatus: BookingStatus | null = null;
  isAddPopupOpen = false;
  isEditPopupOpen = false;
  newBookingStatus: BookingStatusRequest = {
    name: '',
    status: true,
  };
  filter: BookingStatusFilter = {
    search: '',
    page: 1,
    limit: 10,
    total: 0,
    status: '',
    sort: 'createdAt',
    order: 'desc',
  };

  constructor(
    private bookingStatusService: BookingStatusService,
    private toastService: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  async ngOnInit() {
    this.spinner.show();
    try {
      await this.loadInitialData();
    } catch (err) {
      console.error(err);
    } finally {
      this.spinner.hide();
    }
  }

  async loadInitialData() {
    await Promise.all([this.getAllBookingStatuses()]);
  }

  getAllBookingStatuses(): void {
    this.bookingStatusService.getAllBookingStatus(this.filter).subscribe({
      next: (res) => {
        this.bookingStatuses = res.data;
        this.filter.total = res.pagination.total;
      },
      error: (err) => {
        console.error('Error fetching booking statuses:', err);
        this.toastService.error(err.error?.message, 'Lỗi');
        this.bookingStatuses = [];
      },
    });
  }

  onPageChange(page: number): void {
    this.filter.page = page;
    this.getAllBookingStatuses();
  }

  onFilterChange(sortField?: string): void {
    if (sortField) {
      this.filter.sort = sortField;
      this.filter.order = this.filter.order === 'asc' ? 'desc' : 'asc'; // Toggle sort order
    }
    this.filter.page = 1; // Reset to first page on filter change
    this.getAllBookingStatuses();
  }

  onToggleChange(event: Event, item: BookingStatus): void {
    const checkbox = event.target as HTMLInputElement;
    const originalStatus = item.status;
    const newStatus = checkbox.checked;

    // Optimistically update status
    item.status = newStatus;

    this.bookingStatusService.toggleBookingStatus(item.id).subscribe({
      next: () => {
        this.toastService.success(
          `Trạng thái đặt phòng đã được ${
            newStatus ? 'kích hoạt' : 'vô hiệu hóa'
          }`,
          'Thành công'
        );
        this.getAllBookingStatuses();
      },
      error: (err) => {
        // Thất bại → rollback
        item.status = originalStatus;
        this.toastService.error(
          err.error?.message || err.message || err.statusText,
          'Lỗi'
        );
      },
    });
  }

  onOpenPopup(isAddForm: boolean, item?: BookingStatus): void {
    this.isAddPopupOpen = isAddForm;
    this.isEditPopupOpen = !isAddForm;

    if (isAddForm) {
      this.selectedBookingStatus = null;
      this.newBookingStatus = {
        name: '',
        status: true,
        code: '',
      };
    } else if (item) {
      this.selectedBookingStatus = item;
      this.newBookingStatus = {
        name: item.name,
        status: item.status,
        code: item.code,
      };
    }
  }

  onClosePopup(): void {
    this.isAddPopupOpen = false;
    this.isEditPopupOpen = false;
    this.selectedBookingStatus = null;
    this.newBookingStatus = {
      name: '',
      status: true,
      code: '',
    };
  }

  onAddSubmit(): void {
    this.spinner.show();

    this.bookingStatusService
      .createBookingStatus(this.newBookingStatus)
      .pipe(finalize(() => this.spinner.hide()))
      .subscribe({
        next: (res) => {
          this.toastService.success(
            'Thêm trạng thái đặt phòng thành công',
            'Thành công'
          );
          this.getAllBookingStatuses();
          this.onClosePopup();
        },
        error: (err) => {
          console.error('Error adding booking status:', err);
          this.toastService.error(err.error?.message || err.message, 'Lỗi');
        },
      });
  }

  onEditSubmit(): void {
    if (!this.selectedBookingStatus) return;
    this.spinner.show();

    this.bookingStatusService
      .updateBookingStatus(this.selectedBookingStatus.id, this.newBookingStatus)
      .pipe(finalize(() => this.spinner.hide()))
      .subscribe({
        next: (res) => {
          this.toastService.success(
            'Cập nhật trạng thái đặt phòng thành công',
            'Thành công'
          );
          this.getAllBookingStatuses();
          this.onClosePopup();
        },
        error: (err) => {
          console.error('Error updating booking status:', err);
          this.toastService.error(err.error?.message || err.message, 'Lỗi');
        },
      });
  }
}
