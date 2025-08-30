import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment'; // Import từ file cấu hình môi trường
import {
  EmployeeDetailResponse,
  EmployeeFilter,
  EmployeeRequest,
  EmployeeResponse,
} from '@/types/employee';
import { ChangePasswordRequest } from '@/types/auth';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly baseUrl = `${environment.apiUrl}/employee`; // Lấy URL từ file cấu hình môi trường

  constructor(private http: HttpClient) {}

  // ✅ Lấy tất cả nhân viên
  getAllEmployees({
    search = '',
    page = 1,
    limit = 10,
    sort = 'createdAt',
    order = 'desc',
    status,
    role,
    department,
    position,
  }: EmployeeFilter): Observable<EmployeeResponse> {
    let params = new HttpParams()
      .set('search', search)
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sort', sort)
      .set('order', order);
    if (status) params = params.set('status', status);
    if (role) params = params.set('role', role);
    if (department) params = params.set('department', department);
    if (position) params = params.set('position', position);
    return this.http.get<EmployeeResponse>(this.baseUrl, { params });
  }

  // ✅ Lấy nhân viên theo ID
  getEmployeeById(id: string): Observable<EmployeeDetailResponse> {
    return this.http.get<EmployeeDetailResponse>(
      `${this.baseUrl}/user-info/${id}`
    );
  }

  // ✅ Lấy thông tin nhân viên hiện tại
  getCurrentEmployee(): Observable<EmployeeDetailResponse> {
    return this.http.get<EmployeeDetailResponse>(`${this.baseUrl}/me`);
  }

  // ✅ Cập nhật nhân viên
  updateEmployee(
    id: string,
    data: EmployeeRequest
  ): Observable<EmployeeDetailResponse> {
    return this.http.patch<EmployeeDetailResponse>(
      `${this.baseUrl}/update/${id}`,
      data
    );
  }

  // ✅ Đổi mật khẩu
  changePassword(
    id: string,
    data: ChangePasswordRequest
  ): Observable<EmployeeDetailResponse> {
    return this.http.patch<EmployeeDetailResponse>(
      `${this.baseUrl}/change-password/${id}`,
      data
    );
  }

  // ✅ Kích hoạt / vô hiệu hoá nhân viên
  toggleEmployeeStatus(id: string): Observable<EmployeeDetailResponse> {
    return this.http.patch<EmployeeDetailResponse>(
      `${this.baseUrl}/toggle/${id}`,
      {}
    );
  }

  // ✅ (Tùy chọn) Xoá nhân viên
  deleteEmployee(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
}
