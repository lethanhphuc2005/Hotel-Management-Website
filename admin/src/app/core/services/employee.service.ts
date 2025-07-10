import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly API_URL = 'http://127.0.0.1:8000/v1/employee';

  constructor(private http: HttpClient) {}

  // ✅ Lấy tất cả nhân viên
  getAllEmployees(): Observable<any> {
    return this.http.get(`${this.API_URL}`);
  }

  // ✅ Lấy nhân viên theo ID
  getEmployeeById(id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/user-info/${id}`);
  }

  // ✅ Cập nhật nhân viên
  updateEmployee(id: string, data: any): Observable<any> {
    return this.http.put(`${this.API_URL}/update/${id}`, data);
  }

  // ✅ Đổi mật khẩu
 changePassword(employeeId: string, data: { oldPassword: string, newPassword: string }) {
  return this.http.post<any>(`${this.API_URL}/change-password/${employeeId}`, data);
}


  // ✅ Kích hoạt / vô hiệu hoá nhân viên
  toggleEmployeeStatus(id: string): Observable<any> {
    return this.http.put(`${this.API_URL}/toggle/${id}`, {});
  }

  // ✅ (Tùy chọn) Xoá nhân viên
  deleteEmployee(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/delete/${id}`);
  }
}
