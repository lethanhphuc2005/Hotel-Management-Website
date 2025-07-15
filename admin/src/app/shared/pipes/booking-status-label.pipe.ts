import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'bookingStatusLabel' })
export class BookingStatusLabelPipe implements PipeTransform {
  transform(code: string): string {
    switch (code) {
      case 'PENDING':
        return 'Chờ xác nhận';
      case 'CONFIRMED':
        return 'Đã xác nhận';
      case 'CHECKED_IN':
        return 'Đã nhận phòng';
      case 'CHECKED_OUT':
        return 'Đã trả phòng';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  }
}
