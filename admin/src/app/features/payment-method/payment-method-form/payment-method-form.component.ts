import { PaymentMethod, PaymentMethodRequest } from '@/types/payment-method';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment-method-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-method-form.component.html',
  styleUrl: './payment-method-form.component.scss',
})
export class PaymentMethodFormComponent {
  @Input() isEdit: boolean = false;
  @Input() paymentMethod: PaymentMethodRequest = {};
  @Output() submitForm = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
}
