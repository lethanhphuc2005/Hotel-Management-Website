import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-home',
  standalone:true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports:[RouterOutlet, CommonModule, RouterModule]
})
export class DashboardComponent implements AfterViewInit {
  @ViewChild('revenueChart') revenueChartRef!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    const canvas = this.revenueChartRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
        datasets: [{
          data: [4200, 6000, 4700, 9200, 9200, 7800],
          backgroundColor: '#e5e7eb',
          borderRadius: 4,
          barThickness: 40
        }]
      },
      options: {
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: 'white',
              callback: (value) => value + ' USD'
            },
            grid: { color: '#ccc' }
          },
          x: {
            ticks: { color: 'white' },
            grid: { display: false }
          }
        }
      }
    });
  }
}
