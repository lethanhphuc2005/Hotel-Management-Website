import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Booking } from '@/types/booking'; // Điều chỉnh theo dự án bạn
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Discount } from '@/types/discount';

@Component({
  selector: 'app-booking-detail-popup',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './booking-detail-popup.component.html',
  styleUrls: ['./booking-detail-popup.component.scss'],
})
export class BookingDetailPopupComponent {
  @Input() booking!: Booking;
  @Output() onClose = new EventEmitter();

  constructor() {}

  OnInit() {}

  getBookingStatusName(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'Đang chờ xác nhận';
      case 'CONFIRMED':
        return 'Đã xác nhận';
      case 'CANCELLED':
        return 'Đã hủy';
      case 'CHECKED_IN':
        return 'Đã nhận phòng';
      case 'CHECKED_OUT':
        return 'Đã trả phòng';
      default:
        return 'Không rõ trạng thái';
    }
  }

  getBookingPaymentStatusName(status: string): string {
    switch (status) {
      case 'PAID':
        return 'Đã thanh toán';
      case 'UNPAID':
        return 'Chưa thanh toán';
      case 'REFUNDED':
        return 'Đã hoàn tiền';
      default:
        return 'Không rõ trạng thái';
    }
  }

  getPaymentStatusName(status: string): string {
    switch (status) {
      case 'completed':
        return 'Đã thanh toán';
      case 'pending':
        return 'Đang chờ thanh toán';
      default:
        return 'Không rõ trạng thái';
    }
  }

  getDiscountText(discount: Discount): string {
    if (discount.value_type === 'percent') {
      return `Giảm ${discount.value * 100}%`;
    } else if (discount.value_type === 'fixed') {
      return `Giảm ${discount.value} VND`;
    } else {
      return 'Không có giảm giá';
    }
  }
}
