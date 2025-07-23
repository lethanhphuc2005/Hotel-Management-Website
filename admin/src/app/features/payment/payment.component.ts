import { Component, OnInit } from '@angular/core';
import { PaymentService } from '@/core/services/payment.service';
import { Payment, PaymentFilter } from '@/types/payment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PaymentListComponent } from './payment-list/payment-list.component';
import { PaymentMethod } from '@/types/payment-method';
import { PaymentMethodService } from '@/core/services/payment-method.service';
import { PaymentFilterComponent } from './payment-filter/payment-filter.component';
import { PaymentDetailComponent } from './payment-detail/payment-detail.component';

@Component({
  selector: 'app-payment',
  standalone: true,
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    PaymentListComponent,
    PaymentFilterComponent,
    PaymentDetailComponent,
  ],
})
export class PaymentComponent implements OnInit {
  payments: Payment[] = [];
  paymentMethods: PaymentMethod[] = [];
  selectedPayment: Payment | null = null;
  isDetailPopupOpen = false;
  filter: PaymentFilter = {
    search: '',
    page: 1,
    limit: 10,
    sort: 'createdAt',
    order: 'desc',
    status: '',
    method: '',
    payment_date: undefined,
    total: 0,
  };

  constructor(
    private paymentService: PaymentService,
    private toastService: ToastrService,
    private paymentMethodService: PaymentMethodService
  ) {}

  ngOnInit(): void {
    this.fetchPayments();
    this.fetchPaymentMethods();
  }

  fetchPayments(): void {
    this.paymentService.getAllPayments(this.filter).subscribe({
      next: (response) => {
        this.payments = response.data;
        if (response.pagination) {
          this.filter.total = response.pagination.total;
        }
      },
      error: (err) => {
        console.error(err);
        this.toastService.error(err.error?.message, 'Lỗi');
        this.payments = [];
      },
    });
  }

  fetchPaymentMethods(): void {
    this.paymentMethodService
      .getAllPaymentMethods({
        status: 'true',
        limit: 1000,
        total: 0,
        page: 1,
      })
      .subscribe({
        next: (response) => {
          this.paymentMethods = response.data;
        },
        error: (err) => {
          console.error(err);
          this.toastService.error(err.error?.message, 'Lỗi');
        },
      });
  }

  onPageChange(page: number): void {
    this.filter.page = page;
    this.fetchPayments();
  }

  onFilterChange(sortField?: string): void {
    if (sortField) {
      this.filter.sort = sortField;
      this.filter.order = this.filter.order === 'asc' ? 'desc' : 'asc'; // Toggle sort order
    }
    this.filter.page = 1; // Reset to first page on filter change
    this.fetchPayments();
  }

  onOpenPopup(isDetail: boolean, payment?: Payment): void {
    this.isDetailPopupOpen = isDetail;
    if (payment) {
      this.selectedPayment = payment;
    } else {
      this.selectedPayment = null;
    }
  }

  onClosePopup(): void {
    this.isDetailPopupOpen = false;
    this.selectedPayment = null;
  }
}
