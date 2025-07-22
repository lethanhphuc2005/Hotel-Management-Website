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
  @Input() filter: any;
  @Input() paymentMethods: PaymentMethod[] = [];
  @Output() filterChange = new EventEmitter();
}
