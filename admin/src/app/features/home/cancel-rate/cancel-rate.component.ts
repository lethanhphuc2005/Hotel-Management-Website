import { CancelRateStatistics } from '@/types/dashboard';
import { Component, ViewChild, OnInit, Input, OnChanges } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexStroke,
  ApexDataLabels,
  ApexTooltip,
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-cancel-rate',
  templateUrl: './cancel-rate.component.html',
  styleUrls: ['./cancel-rate.component.css'],
  standalone: true,
  imports: [NgApexchartsModule],
})
export class CancelRateChartComponent implements OnChanges {
  @Input() from: string = this.getNDaysAgo(30);
  @Input() to: string = this.getToday();
  @Input() cancelRateData: CancelRateStatistics[] = [];
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions!: Partial<ChartOptions>;

  ngOnChanges(): void {
    console.log('Cancel Rate Data:', this.cancelRateData);
    this.chartOptions = {
      series: [
        {
          name: 'Tỷ lệ huỷ (%)',
          data: this.cancelRateData.map(
            (d) => +(d.cancelRate * 100).toFixed(2)
          ),
        },
      ],
      chart: {
        type: 'line',
        height: 350,
        zoom: {
          enabled: true,
          type: 'x', // hoặc 'y', 'xy'
          autoScaleYaxis: true,
        },
        toolbar: {
          autoSelected: 'zoom',
          tools: {
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
          },
        },
      },
      xaxis: {
        categories: this.cancelRateData.map((d) => d.date),
      },
      yaxis: {
        min: 0,
        max: 100,
        labels: {
          formatter: (val) => `${val}%`,
        },
      },
      stroke: {
        curve: 'smooth',
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        y: {
          formatter: (val) => `${val.toFixed(2)}%`,
        },
      },
    };
  }

  getToday(): string {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  }

  getNDaysAgo(n: number): string {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().slice(0, 10);
  }
}
