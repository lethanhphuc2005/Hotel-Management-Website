import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  PaymentMethodFilter,
  PaymentMethodResponse,
  PaymentMethodDetailResponse,
  PaymentMethodRequest,
} from '@/types/payment-method';
import { environment } from '@env/environment'; // Import từ file cấu hình môi trường

@Injectable({
  providedIn: 'root',
})
export class PaymentMethodService {
  private readonly baseUrl = `${environment.apiUrl}/payment-method`; // Lấy URL từ file cấu hình môi trường

  constructor(private http: HttpClient) {}

  getAllPaymentMethods({
    search = '',
    page = 1,
    limit = 10,
    sort = 'createdAt',
    order = 'desc',
    status,
  }: PaymentMethodFilter): Observable<PaymentMethodResponse> {
    let params = new HttpParams()
      .set('search', search)
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sort', sort)
      .set('order', order);
    if (status) params = params.set('status', status);
    return this.http.get<PaymentMethodResponse>(this.baseUrl, { params });
  }

  getPaymentMethodById(id: string): Observable<PaymentMethodDetailResponse> {
    return this.http.get<PaymentMethodDetailResponse>(`${this.baseUrl}/${id}`);
  }

  createPaymentMethod(
    data: PaymentMethodRequest
  ): Observable<PaymentMethodDetailResponse> {
    return this.http.post<PaymentMethodDetailResponse>(this.baseUrl, data);
  }

  togglePaymentMethodStatus(
    id: string
  ): Observable<PaymentMethodDetailResponse> {
    return this.http.patch<PaymentMethodDetailResponse>(
      `${this.baseUrl}/toggle/${id}`,
      {}
    );
  }

  updatePaymentMethod(
    id: string,
    data: PaymentMethodRequest
  ): Observable<PaymentMethodDetailResponse> {
    return this.http.patch<PaymentMethodDetailResponse>(
      `${this.baseUrl}/${id}`,
      data
    );
  }

  deletePaymentMethod(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
