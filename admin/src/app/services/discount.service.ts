import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Discount } from '../models/discount';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DiscountService {
  private readonly API_URL = 'http://127.0.0.1:8000/v1/discount';

  constructor(private http: HttpClient) {}

 getAll(): Observable<{ data: Discount[] }> {
  return this.http.get<{ data: Discount[] }>(this.API_URL);
}


  add(discount: Discount): Observable<Discount> {
    return this.http.post<Discount>(this.API_URL, discount);
  }

  update(id: string, discount: Discount): Observable<Discount> {
    return this.http.put<Discount>(`${this.API_URL}/${id}`, discount);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

updateStatus(id: string, discount: Partial<Discount>): Observable<Discount> {
  return this.http.put<Discount>(`${this.API_URL}/toggle/${id}`, discount);
}
toggleStatus(id: string) {
  return this.http.put<any>(`${this.API_URL}/toggle/${id}`, {}); // PUT yêu cầu không cần body
}
addWithFormData(formData: FormData): Observable<any> {
  return this.http.post(`${this.API_URL}`, formData);
}

updateWithFormData(id: string, formData: FormData): Observable<any> {
  return this.http.put(`${this.API_URL}/${id}`, formData);
}

 addWithImage(formData: FormData): Observable<any> {
    return this.http.post(`${this.API_URL}`, formData);
  }

  updateWithImage(id: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}`, formData);
  }
}
