import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-revenue-chart',
  templateUrl: './revenue-chart.component.html',
  styleUrl: './revenue-chart.component.css',
})
export class RevenueChartComponent implements OnChanges {
  @Input() revenueByMonth: number[] = [];
  @ViewChild('revenueChartCanvas', { static: true }) chartRef!: ElementRef;
  chart!: Chart;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['revenueByMonth'] && this.revenueByMonth.length) {
      this.renderChart(this.revenueByMonth);
    }
  }

  getLast7MonthsLabels(): string[] {
    const labels: string[] = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      labels.push(`Tháng ${d.getMonth() + 1}`);
    }

    return labels;
  }

  renderChart(monthlyRevenue: number[]) {
    const ctx = this.chartRef.nativeElement as HTMLCanvasElement;

    // Xoá chart cũ nếu có
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.getLast7MonthsLabels(),
        datasets: [
          {
            label: 'Doanh thu (VNĐ)',
            data: monthlyRevenue,
            backgroundColor: '#FAB320',
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => (ctx.raw as number).toLocaleString('vi-VN') + 'đ',
            },
          },
        },
      },
    });
  }

  exportChartAsImage() {
    const canvas = this.chartRef.nativeElement as HTMLCanvasElement;
    const image = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = image;
    link.download = 'revenue-chart.png';
    link.click();
  }

  printChart() {
    const canvas = this.chartRef.nativeElement as HTMLCanvasElement;
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
