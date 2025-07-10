import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Discount } from '../../types/discount';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'; // Import từ file cấu hình môi trường

@Injectable({ providedIn: 'root' })
export class DiscountService {
  private readonly baseUrl = `${environment.apiUrl}/discount`; // Lấy URL từ file cấu hình môi trường

  constructor(private http: HttpClient) {}

 getAll(): Observable<{ data: Discount[] }> {
  return this.http.get<{ data: Discount[] }>(this.baseUrl);
}


  add(discount: Discount): Observable<Discount> {
    return this.http.post<Discount>(this.baseUrl, discount);
  }

  update(id: string, discount: Discount): Observable<Discount> {
    return this.http.put<Discount>(`${this.baseUrl}/${id}`, discount);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

updateStatus(id: string, discount: Partial<Discount>): Observable<Discount> {
  return this.http.put<Discount>(`${this.baseUrl}/toggle/${id}`, discount);
}
toggleStatus(id: string) {
  return this.http.put<any>(`${this.baseUrl}/toggle/${id}`, {}); // PUT yêu cầu không cần body
}
addWithFormData(formData: FormData): Observable<any> {
  return this.http.post(`${this.baseUrl}`, formData);
}

updateWithFormData(id: string, formData: FormData): Observable<any> {
  return this.http.put(`${this.baseUrl}/${id}`, formData);
}

 addWithImage(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}`, formData);
  }

  updateWithImage(id: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, formData);
  }
}
