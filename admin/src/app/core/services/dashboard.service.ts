import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { CancelRateStatistics, DashboardOverview } from '@/types/dashboard';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly baseUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getOverview(): Observable<DashboardOverview> {
    return this.http.get<DashboardOverview>(`${this.baseUrl}/overview`);
  }

  getBookingStatusStatistics(
    period: string,
    from: string | null,
    to: string | null
  ): Observable<any> {
    let params = new HttpParams().set('period', period);
    if (from) {
      params = params.set('from', from);
    }
    if (to) {
      params = params.set('to', to);
    }
    return this.http.get(`${this.baseUrl}/statistics/booking-status`, {
      params,
    });
  }

  getCancelRateStatistics(
    from: string,
    to: string
  ): Observable<CancelRateStatistics[]> {
    const params = new HttpParams().set('from', from).set('to', to);
    return this.http.get<CancelRateStatistics[]>(
      `${this.baseUrl}/statistics/cancellation-rate`,
      { params }
    );
  }
}
