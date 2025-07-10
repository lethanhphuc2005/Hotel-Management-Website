import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BookingStatusService {
  private baseUrl = 'http://localhost:8000/v1/booking-status';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get(`${this.baseUrl}`);
  }

  create(data: any) {
    return this.http.post(`${this.baseUrl}`, data);
  }

 update(id: string, data: any): Observable<any> {
  return this.http.put(`${this.baseUrl}/${id}`, data); // ✅ PUT thay vì PATCH
}

}
