import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Feature } from '../../types/feature';
import { environment } from '../../../environments/environment'; // Import từ file cấu hình môi trường

@Injectable({
  providedIn: 'root'
})
export class FeatureService {
  private readonly baseUrl = `${environment.apiUrl}/feature`; // Lấy URL từ file cấu hình môi trường

  constructor(private http: HttpClient) {}

  // Lấy tất cả tiện nghi với hỗ trợ tìm kiếm, phân trang, sắp xếp, lọc trạng thái
  getAllFeatures(
    search: string = '',
    page: number = 1,
    limit: number = 100,
    sort: string = 'createdAt',
    order: string = 'asc',
    status?: boolean
  ): Observable<{ message: string; data: Feature[] }> {
    let params = new HttpParams()
      .set('search', search)
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sort', sort)
      .set('order', order);

    if (status !== undefined) {
      params = params.set('status', status.toString());
    }

    return this.http.get<{ message: string; data: Feature[] }>(this.baseUrl, { params });
  }

  // Lấy tiện nghi theo ID
  getFeatureById(id: string): Observable<{ message: string; data: Feature }> {
    return this.http.get<{ message: string; data: Feature }>(`${this.baseUrl}/${id}`);
  }

  // Tạo tiện nghi mới (dùng FormData)
  createFeature(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}`, formData);
  }

  // Cập nhật tiện nghi (dùng FormData)
  updateFeature(id: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, formData);
  }

  // Cập nhật trạng thái (kích hoạt / vô hiệu hóa)
 updateStatus(id: string, newStatus: boolean): Observable<any> {
  return this.http.put(`${this.baseUrl}/status/${id}`, { status: newStatus });
}


  // Xóa tiện nghi
  deleteFeature(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
