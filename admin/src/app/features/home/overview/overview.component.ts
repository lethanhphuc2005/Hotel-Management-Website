import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-overview',
  imports: [CommonModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent {
  @Input() totalUsers: number = 0;
  @Input() revenueToday: number = 0;
  @Input() bookingsToday: number = 0;
  @Input() occupancyRate: number = 0;
}
