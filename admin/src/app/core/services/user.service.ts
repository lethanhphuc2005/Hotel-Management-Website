import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserRaw } from '../../types/user';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:8000/v1/user';

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<UserRaw[]> {
    return this.http.get<UserRaw[]>(`${this.apiUrl}`);
  }


  getUserById(id: string) {
    return this.http.get(`${this.apiUrl}/user-info/${id}`);
  }


  toggleUserStatus(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/toggle/${id}`, {});
  }

}
