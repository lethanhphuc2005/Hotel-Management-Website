import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../core/services/payment.service';
import { Payment } from '../../types/payment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-payment',
  standalone: true,
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
})
export class PaymentComponent implements OnInit {
  payments: Payment[] = [];
  searchKeyword: string = '';
  isDetailPopupOpen = false;
  selectedPayment: Payment | null = null;

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.paymentService.getAllPayments().subscribe({
      next: (res: any) => {
        this.payments = res.data;
      },
      error: (err) => {
        console.error('Lỗi tải dữ liệu:', err);
      },
    });
  }

  filteredPayments(): Payment[] {
    if (!this.searchKeyword.trim()) return this.payments;
    const keyword = this.searchKeyword.toLowerCase();
    return this.payments.filter(payment =>
      payment.status.toString().toLowerCase().includes(keyword)
    );
  }

  onSearch(): void {
    // gọi tự động khi nhấn enter
  }

  viewDetail(payment: Payment): void {
    this.selectedPayment = payment;
    this.isDetailPopupOpen = true;
  }

  closeDetailPopup(): void {
    this.isDetailPopupOpen = false;
    this.selectedPayment = null;
  }
}
