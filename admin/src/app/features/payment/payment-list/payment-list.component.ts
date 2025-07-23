import { FormatDatePipe } from '@/shared/pipes/format-date.pipe';
import { Payment, PaymentFilter } from '@/types/payment';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment-list',
  imports: [CommonModule, FormsModule, FormatDatePipe],
  templateUrl: './payment-list.component.html',
  styleUrl: './payment-list.component.scss',
})
export class PaymentListComponent {
  @Input() payments!: Payment[];
  @Input() filter: PaymentFilter = {
    page: 1,
    limit: 10,
    total: 0,
  };
  @Output() openDetail = new EventEmitter<Payment>();
}
