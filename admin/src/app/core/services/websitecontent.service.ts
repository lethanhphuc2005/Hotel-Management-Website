// src/app/services/content.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { IContent } from '../../types/website-content';
import { environment } from '../../../environments/environment'; // Import từ file cấu hình môi trường

@Injectable({
  providedIn: 'root'
})
export class WebsiteContentService {
  private readonly baseUrl = `${environment.apiUrl}/website-content`; // Lấy URL từ file cấu hình môi trường

  constructor(private http: HttpClient) { }

  getAllContents(): Observable<IContent[]> {
    return this.http.get<{ data: IContent[] }>(this.baseUrl).pipe(
      map(res => res.data)
    );
  }

  getContentById(id: string): Observable<IContent> {
    return this.http.get<IContent>(`${this.baseUrl}/${id}`);
  }

  updateContent(id: string, formData: FormData): Observable<IContent> {
    return this.http.put<IContent>(`${this.baseUrl}/${id}`, formData);
  }

  onDelete(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  createContent(formData: FormData) {
    return this.http.post<IContent>(this.baseUrl, formData);
  }


}
