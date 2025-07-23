import { Component, OnInit } from '@angular/core';
import { BookingMethodService } from '../../core/services/booking-method.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  BookingMethod,
  BookingMethodFilter,
  BookingMethodRequest,
} from '@/types/booking-method';
import { ToastrService } from 'ngx-toastr';
import { BookingMethodListComponent } from '@/features/booking-method/booking-method-list/booking-method-list.component';
import { BookingMethodFormComponent } from '@/features/booking-method/booking-method-form/booking-method-form.component';
import { CommonFilterBarComponent } from '@/shared/components/common-filter-bar/common-filter-bar.component';
import { PaginationComponent } from '@/shared/components/pagination/pagination.component';

@Component({
  selector: 'app-booking-method',
  standalone: true,
  templateUrl: './booking-method.component.html',
  styleUrls: ['./booking-method.component.scss'],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    BookingMethodListComponent,
    BookingMethodFormComponent,
    CommonFilterBarComponent,
    PaginationComponent,
  ],
})
export class BookingMethodComponent implements OnInit {
  bookingMethods: BookingMethod[] = [];
  selectedBookingMethod: BookingMethod | null = null;
  isAddPopupOpen = false;
  isEditPopupOpen = false;
  newBookingMethod: BookingMethodRequest = {
    name: '',
    description: '',
    status: true,
  };
  filter: BookingMethodFilter = {
    search: '',
    page: 1,
    limit: 10,
    total: 0,
    status: '',
    sort: 'createdAt',
    order: 'desc',
  };

  constructor(
    private bookingMethodService: BookingMethodService,
    private toastService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getAllBookingMethods();
  }

  getAllBookingMethods(): void {
    this.bookingMethodService
      .getAllBookingMethod(this.filter)
      .subscribe({
        next: (response) => {
          this.bookingMethods = response.data;
          this.filter.total = response.pagination.total;
        },
        error: (error) => {
          console.error('Error fetching booking methods:', error);
        },
      });
  }

  onPageChange(page: number): void {
    this.filter.page = page;
    this.getAllBookingMethods();
  }

  onFilterChange(sortField?: string): void {
    if (sortField) {
      this.filter.sort = sortField;
      this.filter.order = this.filter.order === 'asc' ? 'desc' : 'asc'; // Toggle sort order
    }
    this.filter.page = 1; // Reset to first page on filter change
    this.getAllBookingMethods();
  }

  onToggleChange(event: Event, item: BookingMethod): void {
    const checkbox = event.target as HTMLInputElement;
    const originalStatus = item.status;
    const newStatus = checkbox.checked;

    // Optimistically update status
    item.status = newStatus;

    this.bookingMethodService.toggleBookingMethodStatus(item.id).subscribe({
      next: () => {
        // Thành công → giữ nguyên status
        this.toastService.success(
          `Phương thức đặt phòng ${newStatus ? 'kích hoạt' : 'vô hiệu hóa'} thành công`,
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

  onOpenPopup(isAddForm: boolean, item?: BookingMethod): void {
    this.isAddPopupOpen = isAddForm;
    this.isEditPopupOpen = !isAddForm;

    if (isAddForm) {
      // Reset form thêm mới
      this.selectedBookingMethod = null;
      this.newBookingMethod = {
        name: '',
        description: '',
        status: true,
      };
    } else if (item) {
      this.selectedBookingMethod = item;
      this.newBookingMethod = {
        name: item.name,
        description: item.description,
        status: item.status,
      };
    }
  }

  onClosePopup(): void {
    this.isAddPopupOpen = false;
    this.isEditPopupOpen = false;
    this.selectedBookingMethod = null;
    this.newBookingMethod = {
      name: '',
      description: '',
      status: true,
    };
  }

  onAddSubmit(): void {
    this.bookingMethodService
      .createBookingMethod(this.newBookingMethod)
      .subscribe({
        next: (res) => {
          this.toastService.success(
            res.message || 'Thêm phương thức đặt phòng thành công',
            'Thành công'
          );
          this.getAllBookingMethods();
          this.onClosePopup();
        },
        error: (err) => {
          console.error('Error adding booking status:', err);
          this.toastService.error(err.error?.message || err.message, 'Lỗi');
        },
      });
  }

  onEditSubmit(): void {
    if (!this.selectedBookingMethod) return;

    this.bookingMethodService
      .updateBookingMethod(this.selectedBookingMethod.id, this.newBookingMethod)
      .subscribe({
        next: (res) => {
          this.toastService.success(
            res.message || 'Cập nhật phương thức đặt phòng thành công',
            'Thành công'
          );
          this.getAllBookingMethods();
          this.onClosePopup();
        },
        error: (err) => {
          console.error('Error updating booking status:', err);
          this.toastService.error(err.error?.message || err.message, 'Lỗi');
        },
      });
  }
}
