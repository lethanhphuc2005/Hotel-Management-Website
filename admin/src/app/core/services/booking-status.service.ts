import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@env/environment'; // Import từ file cấu hình môi trường

@Injectable({ providedIn: 'root' })
export class BookingStatusService {
  private readonly baseUrl = `${environment.apiUrl}/booking-status`; // Lấy URL từ file cấu hình môi trường

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  create(data: any) {
    return this.http.post(`${this.baseUrl}`, data);
  }

 update(id: string, data: any): Observable<any> {
  return this.http.put(`${this.baseUrl}/${id}`, data); // ✅ PUT thay vì PATCH
}

}
