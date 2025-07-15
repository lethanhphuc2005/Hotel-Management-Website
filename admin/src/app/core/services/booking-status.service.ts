import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import {
  BookingStatusDetailResponse,
  BookingStatusFilter,
  BookingStatusRequest,
  BookingStatusResponse,
} from '@/types/booking-status';

@Injectable({ providedIn: 'root' })
export class BookingStatusService {
  private readonly baseUrl = `${environment.apiUrl}/booking-status`;

  constructor(private http: HttpClient) {}

  getAllBookingStatus({
    search = '',
    sort = 'createdAt',
    order = 'desc',
    page = 1,
    limit = 10,
    status,
  }: BookingStatusFilter): Observable<BookingStatusResponse> {
    let params = new HttpParams()
      .set('search', search || '')
      .set('sort', sort || 'createdAt')
      .set('order', order || 'desc')
      .set('page', page)
      .set('limit', limit);
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<BookingStatusResponse>(`${this.baseUrl}`, { params });
  }

  toggleBookingStatus(id: string): Observable<BookingStatusDetailResponse> {
    return this.http.put<BookingStatusDetailResponse>(
      `${this.baseUrl}/toggle/${id}`,
      {}
    );
  }

  getBookingStatusById(id: string): Observable<BookingStatusDetailResponse> {
    return this.http.get<BookingStatusDetailResponse>(`${this.baseUrl}/${id}`);
  }

  createBookingStatus(
    data: FormData | BookingStatusRequest
  ): Observable<BookingStatusDetailResponse> {
    return this.http.post<BookingStatusDetailResponse>(`${this.baseUrl}`, data);
  }

  updateBookingStatus(
    id: string,
    data: FormData | BookingStatusRequest
  ): Observable<any> {
    return this.http.put<any>(
      `${this.baseUrl}/${id}`,
      data
    );
  }

  deleteBookingStatus(id: string): Observable<BookingStatusDetailResponse> {
    return this.http.delete<BookingStatusDetailResponse>(
      `${this.baseUrl}/${id}`
    );
  }
}
