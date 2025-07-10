import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRaw } from '../../types/user';
import { environment } from '../../../environments/environment'; // Import từ file cấu hình môi trường

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly baseUrl = `${environment.apiUrl}/user`; // Lấy URL từ file cấu hình môi trường

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<UserRaw[]> {
    return this.http.get<UserRaw[]>(`${this.baseUrl}`);
  }


  getUserById(id: string) {
    return this.http.get(`${this.baseUrl}/user-info/${id}`);
  }


  toggleUserStatus(id: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/toggle/${id}`, {});
  }

}
