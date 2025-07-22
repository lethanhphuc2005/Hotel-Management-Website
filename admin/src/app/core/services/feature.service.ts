import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  FeatureDetailResponse,
  FeatureFilter,
  FeatureResponse,
} from '../../types/feature';
import { environment } from '@env/environment'; // Import từ file cấu hình môi trường

@Injectable({
  providedIn: 'root',
})
export class FeatureService {
  private readonly baseUrl = `${environment.apiUrl}/feature`; // Lấy URL từ file cấu hình môi trường

  constructor(private http: HttpClient) {}

  // Lấy tất cả tiện nghi với hỗ trợ tìm kiếm, phân trang, sắp xếp, lọc trạng thái
  getAllFeatures({
    search = '',
    page = 1,
    limit = 10,
    sort = 'createdAt',
    order = 'desc',
    status = '',
  }: FeatureFilter): Observable<FeatureResponse> {
    let params = new HttpParams()
      .set('search', search)
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sort', sort)
      .set('order', order);
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<FeatureResponse>(this.baseUrl, { params });
  }

  // Lấy tiện nghi theo ID
  getFeatureById(id: string): Observable<FeatureDetailResponse> {
    return this.http.get<FeatureDetailResponse>(`${this.baseUrl}/${id}`);
  }

  // Tạo tiện nghi mới (dùng FormData)
  createFeature(formData: FormData): Observable<FeatureDetailResponse> {
    return this.http.post<FeatureDetailResponse>(`${this.baseUrl}`, formData);
  }

  // Cập nhật tiện nghi (dùng FormData)
  updateFeature(
    id: string,
    formData: FormData
  ): Observable<FeatureDetailResponse> {
    return this.http.patch<FeatureDetailResponse>(
      `${this.baseUrl}/${id}`,
      formData
    );
  }

  // Cập nhật trạng thái (kích hoạt / vô hiệu hóa)
  updateStatus(id: string): Observable<FeatureDetailResponse> {
    return this.http.patch<FeatureDetailResponse>(
      `${this.baseUrl}/toggle/${id}`,
      {}
    );
  }

  // Xóa tiện nghi
  deleteFeature(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
