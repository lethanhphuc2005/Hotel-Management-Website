import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BookingMethod, BookingMethodResponse } from '../../types/method';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class BookingMethodService {
  private readonly baseUrl = `${environment.apiUrl}/booking-method`; // Lấy URL từ file cấu hình môi trường

  constructor(private http: HttpClient) {}

  getAll(): Observable<BookingMethodResponse> {
    return this.http.get<BookingMethodResponse>(this.baseUrl);
  }

  create(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, data);
  }

  update(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }
}
