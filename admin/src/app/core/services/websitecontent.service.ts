// src/app/services/content.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { WebsiteContent } from '../../types/website-content';
import { environment } from '@env/environment'; // Import từ file cấu hình môi trường

@Injectable({
  providedIn: 'root',
})
export class WebsiteContentService {
  private readonly baseUrl = `${environment.apiUrl}/website-content`; // Lấy URL từ file cấu hình môi trường

  constructor(private http: HttpClient) {}

  getAllContents(): Observable<WebsiteContent[]> {
    return this.http
      .get<{ data: WebsiteContent[] }>(this.baseUrl)
      .pipe(map((res) => res.data));
  }

  getContentById(id: string): Observable<WebsiteContent> {
    return this.http.get<WebsiteContent>(`${this.baseUrl}/${id}`);
  }

  updateContent(id: string, formData: FormData): Observable<WebsiteContent> {
    return this.http.put<WebsiteContent>(`${this.baseUrl}/${id}`, formData);
  }

  onDelete(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  createContent(formData: FormData) {
    return this.http.post<WebsiteContent>(this.baseUrl, formData);
  }
}
