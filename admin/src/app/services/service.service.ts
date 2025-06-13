import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private readonly API_URL = 'http://127.0.0.1:8000/v1/service';

  constructor(private http: HttpClient) {}

  // ✅ Lấy danh sách dịch vụ (admin, receptionist)
getAll(params: any = {}): Observable<any> {
  return this.http.get(`${this.API_URL}`, { params });
}


  // ✅ Lấy danh sách cho user
  getAllForUser(params?: any): Observable<any> {
    return this.http.get(`${this.API_URL}/user`, { params });
  }

  // ✅ Lấy dịch vụ theo ID
  getById(id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/${id}`);
  }

  // ✅ Thêm dịch vụ mới
  createService(data: FormData): Observable<any> {
    return this.http.post(`${this.API_URL}`, data);
  }

  // ✅ Cập nhật dịch vụ
  updateService(id: string, data: FormData): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}`, data);
  }

  // ✅ Kích hoạt / Vô hiệu hóa
  toggleStatus(id: string): Observable<any> {
    return this.http.put(`${this.API_URL}/toggle/${id}`, {});
  }

  // ❌ (Ẩn) Xoá dịch vụ
  // deleteService(id: string): Observable<any> {
  //   return this.http.delete(`${this.API_URL}/${id}`);
  // }
}
