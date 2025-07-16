import { Component, OnInit } from '@angular/core';
import { BookingStatusService } from '@/core/services/booking-status.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingStatus, BookingStatusRequest } from '@/types/booking-status';
import { ToastrService } from 'ngx-toastr';
import { PaginationComponent } from '@/shared/components/pagination/pagination.component';
import { BookingStatusListComponent } from '@/features/booking-status/booking-status-list/booking-status-list.component';
import { BookingStatusFormComponent } from '@/features/booking-status/booking-status-form/booking-status-form.component';
import { CommonFilterBarComponent } from '@/shared/components/common-filter-bar/common-filter-bar.component';

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
    CommonFilterBarComponent
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
  filter: {
    keyword: string;
    sortField: string;
    sortOrder: 'asc' | 'desc';
    page: number;
    limit: number;
    total: number;
    status?: string;
  } = {
    keyword: '',
    sortField: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10,
    total: 0,
    status: '', // Optional filter for status
  };

  constructor(
    private bookingStatusService: BookingStatusService,
    private toastService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllBookingStatuses();
  }

  getAllBookingStatuses(): void {
    this.bookingStatusService
      .getAllBookingStatus({
        search: this.filter.keyword,
        sort: this.filter.sortField,
        order: this.filter.sortOrder,
        page: this.filter.page,
        limit: this.filter.limit,
        status: this.filter.status,
      })
      .subscribe({
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
      this.filter.sortField = sortField;
      this.filter.sortOrder = this.filter.sortOrder === 'asc' ? 'desc' : 'asc'; // Toggle sort order
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
        // Thành công → giữ nguyên status
        this.toastService.success(
          'Thay đổi trạng thái đặt phòng thành công',
          'Thành công'
        );
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
      // Reset form thêm mới
      this.selectedBookingStatus = null;
      this.newBookingStatus = {
        name: '',
        status: true,
        code: '',
      };
    } else if (item) {
      console.log('Selected item for edit:', item);
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
  }

  onAddSubmit(): void {
    const formData = new FormData();
    formData.append('name', this.newBookingStatus.name || '');
    formData.append('status', String(this.newBookingStatus.status) || 'true');
    formData.append('code', this.newBookingStatus.code || '');

    this.bookingStatusService.createBookingStatus(formData).subscribe({
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

    const formData = new FormData();
    formData.append('name', this.newBookingStatus.name || '');
    formData.append('code', this.newBookingStatus.code || '');

    this.bookingStatusService
      .updateBookingStatus(this.selectedBookingStatus.id, formData)
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
