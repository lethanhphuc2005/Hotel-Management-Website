import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:8000/v1/user';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/userinfo/${id}`);
  }

  updateUserStatus(user: User): Observable<User> {
    const body = { TrangThai: user.isActive }; // backend vẫn nhận trường TrangThai
    return this.http.put<User>(`${this.apiUrl}/update/${user.id}`, body);
  }

  addRoom(roomData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/rooms`, roomData);
  }

}
