import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate',
  standalone: true, // nếu bạn dùng Angular v14+ standalone component
})
export class FormatDatePipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (!value) return '';

    const date = new Date(value);
    if (isNaN(date.getTime())) return 'Ngày không hợp lệ';

    const day = this.pad(date.getDate());
    const month = this.pad(date.getMonth() + 1);
    const year = date.getFullYear();

    const hours = this.pad(date.getHours());
    const minutes = this.pad(date.getMinutes());

    return `${hours}:${minutes} - ${day}/${month}/${year}`;
  }

  private pad(n: number): string {
    return n < 10 ? '0' + n : '' + n;
  }
}
