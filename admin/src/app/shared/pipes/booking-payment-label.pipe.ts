import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'bookingPaymentLabel' })
export class BookingPaymentLabelPipe implements PipeTransform {
  transform(item: string): string {
    switch (item) {
      case 'PAID':
        return 'Đã thanh toán';
      case 'UNPAID':
        return 'Chưa thanh toán';
      case 'REFUNDED':
        return 'Đã hoàn tiền';
      default:
        return 'Trạng thái không xác định';
    }
  }
}
