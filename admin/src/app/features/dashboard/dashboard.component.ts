import { Component, OnInit } from '@angular/core';
import { DashboardService } from '@/core/services/dashboard.service';
import { Chart } from 'chart.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class DashboardComponent implements OnInit {
  revenueToday = 0;
  bookingsToday = 0;
  occupancyRate = 0;
  revenueByMonth: number[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getOverview().subscribe((data) => {
      this.revenueToday = data.revenueToday;
      this.bookingsToday = data.bookingsToday;
      this.occupancyRate = data.occupancyRate;
      this.revenueByMonth = data.revenueByMonth;
      this.renderChart();
    });
  }

  renderChart(): void {
    const ctx = document.getElementById('revenueChart') as HTMLCanvasElement;
    if (!ctx) return;

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: [
          'Tháng 1',
          'Tháng 2',
          'Tháng 3',
          'Tháng 4',
          'Tháng 5',
          'Tháng 6',
          'Tháng 7',
        ],
        datasets: [
          {
            label: 'Doanh thu theo tháng',
            data: this.revenueByMonth,
            borderColor: '#FAB320',
            backgroundColor: 'rgba(250, 179, 32, 0.1)',
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
          },
        },
      },
    });
  }
}
