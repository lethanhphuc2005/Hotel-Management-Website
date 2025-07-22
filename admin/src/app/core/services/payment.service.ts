import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  PaymentResponse,
  PaymentDetailResponse,
  PaymentFilter,
  PaymentTransactionStatusRequest,
} from '../../types/payment';
import { environment } from '@env/environment'; // Import từ file cấu hình môi trường

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private readonly baseUrl = `${environment.apiUrl}/payment`; // Lấy URL từ file cấu hình môi trường

  constructor(private http: HttpClient) {}

  getAllPayments({
    search = '',
    page = 1,
    limit = 10,
    sort = 'createdAt',
    order = 'desc',
    status,
    method,
    payment_date,
  }: PaymentFilter): Observable<PaymentResponse> {
    let params = new HttpParams()
      .set('search', search)
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sort', sort)
      .set('order', order);
    if (status) params = params.set('status', status);
    if (method) params = params.set('method', method);
    if (payment_date) params = params.set('payment_date', payment_date);

    return this.http.get<PaymentResponse>(this.baseUrl, { params });
  }

  getPaymentById(id: string): Observable<PaymentDetailResponse> {
    return this.http.get<PaymentDetailResponse>(`${this.baseUrl}/${id}`);
  }

  getTransactionStatus({
    method,
    orderId,
    transactionDate,
  }: PaymentTransactionStatusRequest): Observable<string> {
    let params = new HttpParams().set('orderId', orderId);
    if (transactionDate) {
      params = params.set('transactionDate', transactionDate);
    }

    return this.http.get<string>(
      `${this.baseUrl}/${method}/transaction-status`,
      { params }
    );
  }

  deletePayment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
