import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment'; // Import từ file cấu hình môi trường
import {
  ReviewDetailResponse,
  ReviewFilter,
  ReviewRequest,
  ReviewResponse,
} from '@/types/review';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private readonly baseUrl = `${environment.apiUrl}/review`; // Lấy URL từ file cấu hình môi trường

  constructor(private http: HttpClient) {}

  getAllReviews({
    search = '',
    page = 1,
    limit = 10,
    sort = 'createdAt',
    order = 'asc',
    booking_id,
    employee_id,
    user_id,
    status,
    rating,
  }: ReviewFilter): Observable<ReviewResponse> {
    let params = new HttpParams()
      .set('search', search)
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sort', sort)
      .set('order', order);
    if (booking_id) {
      params = params.set('booking_id', booking_id);
    }
    if (employee_id) {
      params = params.set('employee_id', employee_id);
    }
    if (user_id) {
      params = params.set('user_id', user_id);
    }
    if (status) {
      params = params.set('status', status);
    }
    if (rating && rating > 0) {
      params = params.set('rating', rating.toString());
    }
    return this.http.get<ReviewResponse>(this.baseUrl, { params });
  }

  getReviewById(id: string): Observable<ReviewDetailResponse> {
    return this.http.get<ReviewDetailResponse>(`${this.baseUrl}/${id}`);
  }

  createReview(
    data: FormData | ReviewRequest
  ): Observable<ReviewDetailResponse> {
    return this.http.post<ReviewDetailResponse>(this.baseUrl, data);
  }

  toggleReviewStatus(id: string): Observable<ReviewDetailResponse> {
    return this.http.put<ReviewDetailResponse>(
      `${this.baseUrl}/toggle/${id}`,
      {}
    );
  }

  updateReview(
    id: string,
    data: FormData | ReviewRequest
  ): Observable<ReviewDetailResponse> {
    return this.http.put<ReviewDetailResponse>(`${this.baseUrl}/${id}`, data);
  }

  deleteReview(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
