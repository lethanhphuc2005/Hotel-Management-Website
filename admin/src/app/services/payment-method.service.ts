import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentMethod } from '../models/payment-method';

@Injectable({
  providedIn: 'root',
})
export class PaymentMethodService {
  private baseUrl = 'http://localhost:8000/v1/payment-method';

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
