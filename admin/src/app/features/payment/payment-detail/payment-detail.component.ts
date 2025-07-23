import { FormatDatePipe } from '@/shared/pipes/format-date.pipe';
import { Payment } from '@/types/payment';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment-detail',
  imports: [CommonModule, FormsModule, FormatDatePipe],
  templateUrl: './payment-detail.component.html',
  styleUrl: './payment-detail.component.scss'
})
export class PaymentDetailComponent {
  @Input() payment!: Payment;
  @Output() close = new EventEmitter<void>();
}
