import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment'; // Import từ file cấu hình môi trường

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  private readonly baseUrl = `${environment.apiUrl}/service`; // Lấy URL từ file cấu hình môi trường

  constructor(private http: HttpClient) {}

  // ✅ Lấy danh sách dịch vụ (admin, receptionist)
  getAll(params: any = {}): Observable<any> {
    return this.http.get(`${this.baseUrl}`, { params });
  }

  // ✅ Lấy danh sách cho user
  getAllForUser(params?: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/user`, { params });
  }

  // ✅ Lấy dịch vụ theo ID
  getById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  // ✅ Thêm dịch vụ mới
  createService(data: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}`, data);
  }

  // ✅ Cập nhật dịch vụ
  updateService(id: string, data: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  // ✅ Kích hoạt / Vô hiệu hóa
  toggleStatus(id: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/toggle/${id}`, {});
  }

  // ❌ (Ẩn) Xoá dịch vụ
  // deleteService(id: string): Observable<any> {
  //   return this.http.delete(`${this.baseUrl}/${id}`);
  // }
}
