import { FormatDatePipe } from '@/shared/pipes/format-date.pipe';
import { Payment } from '@/types/payment';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-payment-history',
  imports: [CommonModule, FormsModule, FormatDatePipe, RouterModule],
  templateUrl: './payment-history.component.html',
  styleUrl: './payment-history.component.css'
})
export class PaymentHistoryComponent {
  @Input() paymentHistory: Payment[] = [];

  getStatusLabel(status: string): string {
    switch (status) {
      case 'completed':
        return 'Đã hoàn thành';
      case 'pending':
        return 'Đang chờ';
      case 'failed':
        return 'Thất bại';
      default:
        return status;
    }
  }
}
