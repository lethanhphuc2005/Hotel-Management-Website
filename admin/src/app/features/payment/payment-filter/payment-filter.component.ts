import { PaymentFilter } from '@/types/payment';
import { PaymentMethod } from '@/types/payment-method';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment-filter',
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-filter.component.html',
  styleUrl: './payment-filter.component.scss',
})
export class PaymentFilterComponent {
  @Input() filter: PaymentFilter = {
    search: '',
    page: 1,
    limit: 10,
    total: 0,
    sort: 'createdAt',
    order: 'desc',
    status: '',
    method: '',
    payment_date: '',
  };
  @Input() paymentMethods: PaymentMethod[] = [];
  @Output() filterChange = new EventEmitter<string>();
}
