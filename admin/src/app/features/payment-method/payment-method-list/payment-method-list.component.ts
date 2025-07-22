import { PaymentMethod } from '@/types/payment-method';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment-method-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-method-list.component.html',
  styleUrl: './payment-method-list.component.scss',
})
export class PaymentMethodListComponent {
  @Input() paymentMethods: PaymentMethod[] = [];
  @Input() filter: any;
  @Output() openEdit = new EventEmitter();
  @Output() toggleStatus = new EventEmitter();
}
