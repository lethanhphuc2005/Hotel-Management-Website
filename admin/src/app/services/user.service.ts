import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:8000/v1/user';

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<User[]> {
    return this.http.get<{ data: any[] }>(this.apiUrl).pipe(
      map(res => res.data)
    );
  }

  getUserById(id: string) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }


 toggleUserStatus(id: string): Observable<any> {
  return this.http.put(`${this.apiUrl}/toggle/${id}`, {});
}



}
