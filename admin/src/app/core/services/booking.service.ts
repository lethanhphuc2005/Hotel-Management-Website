// src/app/services/booking.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import {
  BookingCancel,
  BookingCheckIn,
  BookingCheckOut,
  BookingConfirm,
  BookingFilter,
  BookingResponse,
  BookingStatusUpdateResponse,
} from '@/types/booking';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private readonly baseUrl = `${environment.apiUrl}/booking`; // Lấy URL từ file cấu hình môi trường

  constructor(private http: HttpClient) {}

  getAllBookings({
    search = '',
    order = 'asc',
    sort = 'booking_date',
    page = 1,
    limit = 10,
    status,
    user,
    method,
    payment_status,
    check_in_date,
    check_out_date,
    booking_date,
  }: BookingFilter): Observable<BookingResponse> {
    let params = new HttpParams()
      .set('search', search)
      .set('order', order)
      .set('sort', sort)
      .set('page', page.toString())
      .set('limit', limit.toString());
    if (status) {
      params = params.set('status', status);
    }
    if (user) {
      params = params.set('user', user);
    }
    if (method) {
      params = params.set('method', method);
    }
    if (payment_status) {
      params = params.set('payment_status', payment_status);
    }
    if (check_in_date) {
      params = params.set('check_in_date', check_in_date);
    }
    if (check_out_date) {
      params = params.set('check_out_date', check_out_date);
    }
    if (booking_date) {
      params = params.set('booking_date', booking_date);
    }

    return this.http.get<BookingResponse>(this.baseUrl, { params });
  }

  cancelBooking({
    id,
    reason,
  }: BookingCancel): Observable<BookingStatusUpdateResponse> {
    return this.http.put<BookingStatusUpdateResponse>(
      `${this.baseUrl}/cancel/${id}`,
      { reason }
    );
  }

  confirmBooking({
    id,
    roomAssignments,
  }: BookingConfirm): Observable<BookingStatusUpdateResponse> {
    return this.http.put<BookingStatusUpdateResponse>(
      `${this.baseUrl}/confirm/${id}`,
      {
        roomAssignments,
      }
    );
  }

  checkInBooking({
    id,
    identity,
  }: BookingCheckIn): Observable<BookingStatusUpdateResponse> {
    return this.http.put<BookingStatusUpdateResponse>(
      `${this.baseUrl}/check-in/${id}`,
      {
        identity,
      }
    );
  }

  checkOutBooking({
    id,
    note,
  }: BookingCheckOut): Observable<BookingStatusUpdateResponse> {
    return this.http.put<BookingStatusUpdateResponse>(
      `${this.baseUrl}/check-out/${id}`,
      {
        note,
      }
    );
  }
}
