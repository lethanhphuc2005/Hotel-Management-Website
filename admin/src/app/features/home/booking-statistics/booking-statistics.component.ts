import { BookingStatusStatistics } from '@/types/dashboard';
import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-booking-statistics',
  templateUrl: './booking-statistics.component.html',
  styleUrls: ['./booking-statistics.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class BookingStatisticsComponent implements OnChanges {
  @Input() statusStats: BookingStatusStatistics = {};
  @Input() period: 'day' | 'week' | 'month' = 'day'; // input period
  @Input() from?: string | null; // input from date
  @Input() to?: string | null; // input to date

  @ViewChild('pieCanvas') pieCanvas!: ElementRef<HTMLCanvasElement>;
  pieChart: Chart | undefined;

  selectedPeriod: 'day' | 'week' | 'month' | 'custom' = 'day';
  customFrom?: string;
  customTo?: string;

  @Output() periodChange = new EventEmitter<{
    period: string;
    from?: string;
    to?: string;
  }>();

  onPeriodChange() {
    if (this.selectedPeriod !== 'custom') {
      this.periodChange.emit({ period: this.selectedPeriod });
    }
  }

  onCustomDateChange() {
    if (this.customFrom && this.customTo) {
      this.periodChange.emit({
        period: 'custom',
        from: this.customFrom,
        to: this.customTo,
      });
    }
  }

  chartLegend: {
    label: string;
    color: string;
    value: number;
    difference: number;
    percentageChange: number;
  }[] = [];

  ngOnChanges(changes: SimpleChanges) {
    // chỉ tạo chart khi statusStats thay đổi
    if (
      changes['statusStats'] ||
      changes['from'] ||
      changes['to'] ||
      changes['period']
    ) {
      this.createPieChart();
    }
  }

  getLabelName(label: string): string {
    switch (label) {
      case 'PENDING':
        return 'Chờ xác nhận';
      case 'CONFIRMED':
        return 'Đã xác nhận';
      case 'CHECKED_IN':
        return 'Đã nhận phòng';
      case 'CHECKED_OUT':
        return 'Đã trả phòng';
      case 'CANCELLED':
        return 'Đã huỷ';
      default:
        return label;
    }
  }

  getColorByStatus(status: string): string {
    switch (status) {
      case 'PENDING':
        return '#f59e0b';
      case 'CONFIRMED':
        return '#52a8c8ff';
      case 'CHECKED_IN':
        return '#22c55e';
      case 'CHECKED_OUT':
        return '#ef4444';
      case 'CANCELLED':
        return '#6b7280';
      default:
        return '#000000';
    }
  }

  private safeNumber(value?: number) {
    return typeof value === 'number' ? value : 0;
  }

  createPieChart() {
    // rebuild chartLegend từ statusStats
    const labels = Object.keys(this.statusStats);

    this.chartLegend = labels.map((label) => ({
      label,
      color: this.getColorByStatus(label),
      value: this.safeNumber(this.statusStats[label]?.current),
      difference: this.safeNumber(this.statusStats[label]?.difference),
      percentageChange: this.safeNumber(
        this.statusStats[label]?.percentageChange
      ),
    }));

    // destroy chart cũ nếu có
    if (this.pieChart) {
      this.pieChart.destroy();
    }

    const ctx = this.pieCanvas.nativeElement;
    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.chartLegend.map((item) => this.getLabelName(item.label)),
        datasets: [
          {
            data: this.chartLegend.map((item) => item.value),
            backgroundColor: this.chartLegend.map((item) => item.color),
            borderWidth: 2,
            borderColor: '#fff',
            hoverOffset: 10,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: { display: false },
        },
      },
    });
  }

  exportChartAsImage() {
    const canvas = this.pieCanvas.nativeElement;
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'booking-statistics.png';
    link.click();
  }

  printChart() {
    const canvas = this.pieCanvas.nativeElement;
    const dataUrl = canvas.toDataURL();

    const windowContent = `
      <!DOCTYPE html>
      <html>
        <head><title>Print Chart</title></head>
        <body>
          <img src="${dataUrl}" style="max-width:100%;"/>
          <script>
            window.onload = () => {
              window.print();
              window.onafterprint = () => window.close();
            };
          </script>
        </body>
      </html>`;

    const printWin = window.open('', '', 'width=800,height=600');
    if (printWin) {
      printWin.document.open();
      printWin.document.write(windowContent);
      printWin.document.close();
    }
  }

  getComparisonTitle(): string {
    if (this.selectedPeriod === 'day') {
      return 'So với ngày hôm qua';
    } else if (this.selectedPeriod === 'week') {
      return 'So với tuần trước';
    } else if (this.selectedPeriod === 'month') {
      return 'So với tháng trước';
    } else if (
      this.selectedPeriod === 'custom' &&
      this.customFrom &&
      this.customTo
    ) {
      // hiển thị theo định dạng ngày
      const fromDate = new Date(this.customFrom);
      const toDate = new Date(this.customTo);
      const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      };
      const fromStr = fromDate.toLocaleDateString('vi-VN', options);
      const toStr = toDate.toLocaleDateString('vi-VN', options);
      return `So với khoảng thời gian trước (${fromStr} → ${toStr})`;
    } else {
      return 'So với trước';
    }
  }
}
