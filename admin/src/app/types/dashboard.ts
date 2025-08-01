export interface DashboardOverview {
  totalUsers: number;
  revenueToday: number;
  bookingsToday: number;
  occupancyRate: number;
  revenueByMonth: number[];
}

export interface StatusStatistics {
  today: number;
  yesterday: number;
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
