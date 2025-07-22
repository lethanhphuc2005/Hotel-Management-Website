import { Component, OnInit } from '@angular/core';
import {
  PaymentMethod,
  PaymentMethodFilter,
  PaymentMethodRequest,
} from '@/types/payment-method';
import { PaymentMethodService } from '@/core/services/payment-method.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PaymentMethodListComponent } from './payment-method-list/payment-method-list.component';
import { CommonFilterBarComponent } from '@/shared/components/common-filter-bar/common-filter-bar.component';
import { PaymentMethodFormComponent } from './payment-method-form/payment-method-form.component';
import { PaginationComponent } from '@/shared/components/pagination/pagination.component';

@Component({
  selector: 'app-payment-method',
  standalone: true,
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    PaymentMethodListComponent,
    CommonFilterBarComponent,
    PaymentMethodFormComponent,
    PaginationComponent
  ],
})
export class PaymentMethodComponent implements OnInit {
  paymentMethods: PaymentMethod[] = [];
  selectedPaymentMethod: PaymentMethod | null = null;
  isAddPopupOpen = false;
  isEditPopupOpen = false;
  newPaymentMethod: PaymentMethodRequest = {
    name: '',
    status: true,
  };
  filter: PaymentMethodFilter = {
    search: '',
    page: 1,
    limit: 10,
    sort: 'createdAt',
    order: 'desc',
    total: 0,
    status: '',
  };
  constructor(
    private paymentMethodService: PaymentMethodService,
    private toastService: ToastrService
  ) {}

  ngOnInit(): void {
    this.fetchPaymentMethods();
  }

  fetchPaymentMethods(): void {
    this.paymentMethodService.getAllPaymentMethods(this.filter).subscribe({
      next: (response) => {
        this.paymentMethods = response.data;
        this.filter.total = response.pagination?.total;
      },
      error: (err) => {
        console.error(err);
        this.toastService.error(err.error?.message, 'Lỗi');
        this.paymentMethods = [];
      },
    });
  }

  onPageChange(page: number): void {
    this.filter.page = page;
    this.fetchPaymentMethods();
  }

  onFilterChange(sortField?: string): void {
    if (sortField) {
      this.filter.sort = sortField;
      this.filter.order = this.filter.order === 'asc' ? 'desc' : 'asc';
    }
    this.filter.page = 1; // Reset to first page on filter change
    this.fetchPaymentMethods();
  }

  onOpenPopup(isAdd: boolean, item?: PaymentMethod): void {
    this.isAddPopupOpen = isAdd;
    this.isEditPopupOpen = !isAdd;
    if (isAdd) {
      this.selectedPaymentMethod = null;
      this.newPaymentMethod = { name: '', status: true };
    } else if (item) {
      this.selectedPaymentMethod = item;
      this.newPaymentMethod = {
        name: item.name,
        status: item.status,
      };
    }
  }

  onClosePopup(): void {
    this.isAddPopupOpen = false;
    this.isEditPopupOpen = false;
    this.selectedPaymentMethod = null;
  }

  onToggleChange(event: Event, item: PaymentMethod): void {
    const checkbox = event.target as HTMLInputElement;
    const originalStatus = item.status;
    const newStatus = checkbox.checked;

    // Optimistically update status
    item.status = newStatus;

    this.paymentMethodService.togglePaymentMethodStatus(item.id).subscribe({
      next: () => {
        this.toastService.success(
          `Phương thức thanh toán ${
            newStatus ? 'được kích hoạt' : 'bị vô hiệu hóa'
          }`,
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

  onAddSubmit(): void {
    const formData = new FormData();
    formData.append('name', this.newPaymentMethod.name || '');
    formData.append(
      'status',
      this.newPaymentMethod.status?.toString() || 'true'
    );

    this.paymentMethodService.createPaymentMethod(formData).subscribe({
      next: () => {
        this.fetchPaymentMethods();
        this.isAddPopupOpen = false;
        this.newPaymentMethod = { name: '', status: true }; // Reset form
        this.toastService.success(
          'Thêm phương thức thanh toán thành công',
          'Thành công'
        );
      },
      error: (err) => {
        this.toastService.error(
          err.error?.message || err.message || err.statusText,
          'Lỗi'
        );
      },
    });
  }

  onEditSubmit(): void {
    if (!this.selectedPaymentMethod) return;

    const formData = new FormData();
    formData.append('name', this.newPaymentMethod.name || '');

    this.paymentMethodService
      .updatePaymentMethod(this.selectedPaymentMethod.id, formData)
      .subscribe({
        next: () => {
          this.fetchPaymentMethods();
          this.isEditPopupOpen = false;
          this.selectedPaymentMethod = null;
          this.newPaymentMethod = { name: '', status: true }; // Reset form
          this.toastService.success(
            'Cập nhật phương thức thanh toán thành công',
            'Thành công'
          );
        },
        error: (err) => {
          this.toastService.error(
            err.error?.message || err.message || err.statusText,
            'Lỗi'
          );
        },
      });
  }
}
