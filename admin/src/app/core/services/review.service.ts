import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'; // Import từ file cấu hình môi trường

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly baseUrl = `${environment.apiUrl}/review`; // Lấy URL từ file cấu hình môi trường

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

update(id: string, data: any) {
  return this.http.put(`${this.baseUrl}/toggle/${id}`, data);
}


}
