import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentMethod } from '../../types/method';
import { environment } from '@env/environment'; // Import từ file cấu hình môi trường

@Injectable({
  providedIn: 'root',
})
export class PaymentMethodService {
  private readonly baseUrl = `${environment.apiUrl}/payment-method`; // Lấy URL từ file cấu hình môi trường

  constructor(private http: HttpClient) {}

  getAll(search = ''): Observable<any> {
    const params = new HttpParams().set('search', search);
    return this.http.get<any>(this.baseUrl, { params });
  }

  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  add(method: Partial<PaymentMethod>): Observable<any> {
    return this.http.post<any>(this.baseUrl, method);
  }

  update(id: string, method: Partial<PaymentMethod>): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, method);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}
