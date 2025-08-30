export interface DashboardOverview {
  totalUsers: number;
  revenueToday: number;
  bookingsToday: number;
  occupancyRate: number;
  revenueByMonth: number[];
}

export interface StatusStatistics {
  current: number;
  previous: number;
  difference: number;
  percentageChange: number;
}

export interface BookingStatusStatistics {
  [statusCode: string]: StatusStatistics;
}

export interface CancelRateStatistics {
  date: string;
  cancelRate: number;
}
