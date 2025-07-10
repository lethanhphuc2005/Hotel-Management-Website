import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BookingMethod } from '../../types/booking-method';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingMethodService {
  private apiUrl = 'http://127.0.0.1:8000/v1/booking-method';

  constructor(private http: HttpClient) {}

  getAll(): Observable<BookingMethod[]> {
    return this.http.get<BookingMethod[]>(this.apiUrl);
  }

  create(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }

  update(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }
}

