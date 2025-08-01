import { BookingStatusStatistics } from '@/types/dashboard';
import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
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
  @ViewChild('pieCanvas') pieCanvas!: ElementRef;
  pieChart: any;
  chartLegend: {
    label: string;
    color: string;
    value: number;
    difference: number;
    percentageChange: number;
  } [] = [];

  ngOnChanges() {
    this.createPieChart();
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
        return '#f59e0b'; // amber
      case 'CONFIRMED':
        return '#52a8c8ff'; // blue
      case 'CHECKED_IN':
        return '#22c55e'; // green
      case 'CHECKED_OUT':
        return '#ef4444'; // red
      case 'CANCELLED':
        return '#6b7280'; // gray
      default:
        return '#000000'; // fallback color
    }
  }

  createPieChart() {
    const labels = Object.keys(this.statusStats);
    const values = labels.map((label) => this.statusStats[label]?.today || 0);

    this.chartLegend = labels.map((label) => ({
      label,
      color: this.getColorByStatus(label),
      value: this.statusStats[label]?.today || 0,
      difference: this.statusStats[label]?.difference || 0,
      percentageChange: this.statusStats[label]?.percentageChange || 0,
    }));

    // Destroy old chart if exists
    if (this.pieChart) this.pieChart.destroy();

    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: this.chartLegend.map((item) => this.getLabelName(item.label)),
        datasets: [
          {
            data: values,
            backgroundColor: this.chartLegend.map((item) => item.color),
            borderWidth: 2,
            borderColor: '#fff',
            hoverOffset: 10,
          },
        ],
      },
      options: {
        responsive: false,
        cutout: '0%',
        plugins: {
          legend: { display: false },
          title: { display: false },
        },
      },
    });
  }

  exportChartAsImage() {
    const canvas = this.pieCanvas.nativeElement as HTMLCanvasElement;
    const image = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = image;
    link.download = 'booking-statistics-chart.png';
    link.click();
  }

  printChart() {
    const canvas = this.pieCanvas.nativeElement as HTMLCanvasElement;
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
}
