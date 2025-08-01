import { DashboardService } from '@/core/services/dashboard.service';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { RevenueChartComponent } from './revenue-chart/revenue-chart.component';
import {
  BookingStatusStatistics,
  CancelRateStatistics,
} from '@/types/dashboard';
import { BookingStatisticsComponent } from './booking-statistics/booking-statistics.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { PaymentService } from '@/core/services/payment.service';
import { Payment } from '@/types/payment';
import { ToastrService } from 'ngx-toastr';
import { NewUserComponent } from './new-user/new-user.component';
import { UserService } from '@/core/services/user.service';
import { User } from '@/types/user';
import { CancelRateChartComponent } from './cancel-rate/cancel-rate.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    RouterModule,
    OverviewComponent,
    RevenueChartComponent,
    BookingStatisticsComponent,
    PaymentHistoryComponent,
    NewUserComponent,
    CancelRateChartComponent
  ],
})
export class HomeComponent implements OnInit {
  totalUsers = 0;
  revenueToday = 0;
  bookingsToday = 0;
  occupancyRate = 0;
  revenueByMonth: number[] = [];
  statusStats: BookingStatusStatistics = {};
  paymentHistory: Payment[] = [];
  newUsers: User[] = [];
  cancelRateData: CancelRateStatistics[] = [];
  from = this.getNDaysAgo(30);
  to = this.getToday();

  getToday(): string {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  }

  getNDaysAgo(n: number): string {
    const date = new Date();
    date.setDate(date.getDate() - n);
    return date.toISOString().slice(0, 10);
  }

  constructor(
    private dashboardService: DashboardService,
    private paymentService: PaymentService,
    private userService: UserService,
    private toastService: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  async ngOnInit() {
    this.spinner.show();
    try {
      await this.loadInitialData();
    } catch (err) {
      console.error(err);
    } finally {
      this.spinner.hide();
    }
  }

  async loadInitialData() {
    await Promise.all([
      this.fetchOverview(),
      this.fetchBookingStatusStatistics(),
      this.fetchPaymentHistory(),
      this.fetchNewUsers(),
      this.fetchCancelRateStatistics(),
    ]);
  }

  fetchOverview() {
    this.dashboardService.getOverview().subscribe({
      next: (data) => {
        this.totalUsers = data.totalUsers;
        this.revenueToday = data.revenueToday;
        this.bookingsToday = data.bookingsToday;
        this.occupancyRate = data.occupancyRate;
        this.revenueByMonth = data.revenueByMonth;
      },
      error: (err) => {
        this.toastService.error('Error fetching overview data');
        console.error('Error fetching overview:', err);
      },
    });
  }

  fetchBookingStatusStatistics() {
    this.dashboardService.getBookingStatusStatistics().subscribe({
      next: (res) => {
        this.statusStats = res.data;
      },
      error: (err) => {
        this.toastService.error('Error fetching booking status statistics');
        console.error('Error fetching booking status statistics:', err);
      },
    });
  }

  fetchPaymentHistory() {
    this.paymentService
      .getAllPayments({
        limit: 7,
        total: 0,
        page: 1,
      })
      .subscribe({
        next: (response) => {
          this.paymentHistory = response.data;
        },
        error: (err) => {
          this.toastService.error('Error fetching payment history');
          console.error('Error fetching payment history:', err);
        },
      });
  }

  fetchNewUsers() {
    this.userService
      .getAllUsers({
        page: 1,
        limit: 7,
        total: 0,
        sort: 'createdAt',
      })
      .subscribe({
        next: (res) => {
          this.newUsers = res.data;
        },
        error: (err) => {
          this.toastService.error('Error fetching new users');
          console.error('Error fetching new users:', err);
        },
      });
  }

  fetchCancelRateStatistics() {
    this.dashboardService
      .getCancelRateStatistics(this.from, this.to)
      .subscribe({
        next: (data) => {
          this.cancelRateData = data;
        },
        error: (err) => {
          this.toastService.error('Error fetching cancel rate statistics');
          console.error('Error fetching cancel rate statistics:', err);
        },
      });
  }
}
