import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BookingMethodDetailResponse,
  BookingMethodFilter,
  BookingMethodRequest,
  BookingMethodResponse,
} from '@/types/booking-method';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class BookingMethodService {
  private readonly baseUrl = `${environment.apiUrl}/booking-method`; // Lấy URL từ file cấu hình môi trường

  constructor(private http: HttpClient) {}

  getAllBookingMethod({
    search = '',
    page = 1,
    limit = 10,
    status,
    order = 'asc',
    sort = 'createdAt',
  }: BookingMethodFilter): Observable<BookingMethodResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('search', search)
      .set('order', order)
      .set('sort', sort);
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<BookingMethodResponse>(this.baseUrl, { params });
  }

  getBookingMethodById(id: string): Observable<BookingMethodDetailResponse> {
    return this.http.get<BookingMethodDetailResponse>(`${this.baseUrl}/${id}`);
  }

  createBookingMethod(
    data: FormData | BookingMethodRequest
  ): Observable<BookingMethodDetailResponse> {
    return this.http.post<BookingMethodDetailResponse>(this.baseUrl, data);
  }

  toggleBookingMethodStatus(
    id: string
  ): Observable<BookingMethodDetailResponse> {
    return this.http.put<BookingMethodDetailResponse>(
      `${this.baseUrl}/toggle/${id}`,
      {}
    );
  }

  updateBookingMethod(
    id: string,
    data: FormData | BookingMethodRequest
  ): Observable<BookingMethodDetailResponse> {
    return this.http.put<BookingMethodDetailResponse>(
      `${this.baseUrl}/${id}`,
      data
    );
  }

  deleteBookingMethod(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
