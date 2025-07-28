import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '@/types/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = environment.apiUrl; // Lấy URL từ file cấu hình môi trường

  constructor(private httpClient: HttpClient) {}

  /**
   * Gọi API đăng nhập
   * @param body Dữ liệu đăng nhập (name và password)
   */
  login(body: LoginRequest): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(
      `${this.baseUrl}/auth/login`,
      body,
      { withCredentials: true }
    );
  }

  /**
   * Gọi API đăng ký
   * @param body Dữ liệu đăng ký
   */
  register(body: RegisterRequest): Observable<RegisterResponse> {
    return this.httpClient.post<RegisterResponse>(
      `${this.baseUrl}/auth/register`,
      body
    );
  }

  /**
   * Kiểm tra user hiện tại có phải admin không
   * @returns Trả về user nếu là admin, ngược lại false
   */
  // checkAdmin() {
  //   const jsonData = localStorage.getItem('accessToken');
  //   if (jsonData) {
  //     const user = JSON.parse(jsonData);
  //     return user.admin === true ? user : false;
  //   }
  //   return false;
  // }

  /**
   * Kiểm tra có người dùng đang đăng nhập không
   * @returns Trả về object user nếu có, ngược lại false
   */
  checkLogin() {
    const jsonData = localStorage.getItem('accessToken');
    return jsonData ? JSON.parse(jsonData) : false;
  }

  /**
   * Kiểm tra async xem user có phải admin không (trả về Promise<boolean>)
   */
  isAdmin(): Promise<boolean> {
    return new Promise((resolve) => {
      const jsonData = localStorage.getItem('accessToken');
      if (jsonData) {
        const user = JSON.parse(jsonData);
        resolve(user.admin === true);
      } else {
        resolve(false);
      }
    });
  }

  // Đăng xuất người dùng
  logout(): Observable<void> {
    return this.httpClient.post<void>(
      `${this.baseUrl}/auth/logout-admin`,
      {},
      {
        withCredentials: true,
      }
    );
  }
}
