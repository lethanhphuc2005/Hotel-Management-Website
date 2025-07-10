import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'; // Import từ file cấu hình môi trường

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly baseUrl = `${environment.apiUrl}/employee`; // Lấy URL từ file cấu hình môi trường

  constructor(private http: HttpClient) {}

  // ✅ Lấy tất cả nhân viên
  getAllEmployees(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  // ✅ Lấy nhân viên theo ID
  getEmployeeById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/user-info/${id}`);
  }

  // ✅ Cập nhật nhân viên
  updateEmployee(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${id}`, data);
  }

  // ✅ Đổi mật khẩu
 changePassword(employeeId: string, data: { oldPassword: string, newPassword: string }) {
  return this.http.post<any>(`${this.baseUrl}/change-password/${employeeId}`, data);
}


  // ✅ Kích hoạt / vô hiệu hoá nhân viên
  toggleEmployeeStatus(id: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/toggle/${id}`, {});
  }

  // ✅ (Tùy chọn) Xoá nhân viên
  deleteEmployee(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }
}
