import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  DiscountDetailResponse,
  DiscountFilter,
  DiscountRequest,
  DiscountResponse,
} from '@/types/discount';
import { Observable } from 'rxjs';
import { environment } from '@env/environment'; // Import từ file cấu hình môi trường

@Injectable({ providedIn: 'root' })
export class DiscountService {
  private readonly baseUrl = `${environment.apiUrl}/discount`; // Lấy URL từ file cấu hình môi trường

  constructor(private http: HttpClient) {}

  getAllDiscounts({
    page = 1,
    limit = 10,
    sort = 'createdAt',
    order = 'desc',
    search = '',
    type,
    status,
    value_type,
    valid_from,
    valid_to,
    priority,
    apply_to,
    min_advance_days,
    max_advance_days,
    min_stay_nights,
    max_stay_nights,
    min_rooms,
    user_level,
  }: DiscountFilter): Observable<DiscountResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sort', sort)
      .set('order', order)
      .set('search', search);
    if (status) params = params.set('status', status);
    if (type) params = params.set('type', type);
    if (value_type) params = params.set('value_type', value_type);
    if (valid_from) params = params.set('valid_from', valid_from);
    if (valid_to) params = params.set('valid_to', valid_to);
    if (priority && priority > 0)
      params = params.set('priority', priority.toString());
    if (apply_to) params = params.set('apply_to', apply_to);
    if (min_advance_days && Number(min_advance_days) > 0)
      params = params.set('min_advance_days', min_advance_days.toString());
    if (max_advance_days && Number(max_advance_days) > 0)
      params = params.set('max_advance_days', max_advance_days.toString());
    if (min_stay_nights && Number(min_stay_nights) > 0)
      params = params.set('min_stay_nights', min_stay_nights.toString());
    if (max_stay_nights && Number(max_stay_nights) > 0)
      params = params.set('max_stay_nights', max_stay_nights.toString());
    if (min_rooms && Number(min_rooms) > 0)
      params = params.set('min_rooms', min_rooms.toString());
    if (user_level) params = params.set('user_level', user_level);
    return this.http.get<DiscountResponse>(this.baseUrl, { params });
  }

  getDiscountById(id: string): Observable<DiscountDetailResponse> {
    return this.http.get<DiscountDetailResponse>(`${this.baseUrl}/${id}`);
  }

  createDiscount(
    data: FormData | DiscountRequest
  ): Observable<DiscountDetailResponse> {
    return this.http.post<DiscountDetailResponse>(this.baseUrl, data);
  }

  updateDiscount(
    id: string,
    data: FormData | DiscountRequest
  ): Observable<DiscountDetailResponse> {
    return this.http.patch<DiscountDetailResponse>(`${this.baseUrl}/${id}`, data);
  }

  toggleDiscountStatus(id: string): Observable<DiscountDetailResponse> {
    return this.http.patch<DiscountDetailResponse>(
      `${this.baseUrl}/toggle/${id}`,
      {}
    );
  }

  deleteDiscount(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
