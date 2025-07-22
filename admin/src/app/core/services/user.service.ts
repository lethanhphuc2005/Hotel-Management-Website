import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserDetailResponse, UserFilter, UserResponse } from '@/types/user';
import { environment } from '@env/environment'; // Import từ file cấu hình môi trường

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly baseUrl = `${environment.apiUrl}/user`; // Lấy URL từ file cấu hình môi trường

  constructor(private http: HttpClient) {}

  getAllUsers({
    search = '',
    page = 1,
    limit = 10,
    sort = 'createdAt',
    order = 'desc',
    status,
    is_verified,
    level,
  }: UserFilter): Observable<UserResponse> {
    let params = new HttpParams()
      .set('search', search)
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sort', sort)
      .set('order', order);
    if (status) {
      params = params.set('status', status);
    }
    if (is_verified) {
      params = params.set('is_verified', is_verified);
    }
    if (level) {
      params = params.set('level', level);
    }
    return this.http.get<UserResponse>(this.baseUrl, { params });
  }

  getUserById(id: string): Observable<UserDetailResponse> {
    return this.http.get<UserDetailResponse>(`${this.baseUrl}/user-info/${id}`);
  }

  toggleUserStatus(id: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/toggle/${id}`, {});
  }
}
