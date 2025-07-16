// src/app/services/content.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment'; // Import từ file cấu hình môi trường
import {
  WebsiteContentDetailResponse,
  WebsiteContentFilter,
  WebsiteContentRequest,
  WebsiteContentResponse,
} from '@/types/website-content';

@Injectable({
  providedIn: 'root',
})
export class WebsiteContentService {
  private readonly baseUrl = `${environment.apiUrl}/website-content`; // Lấy URL từ file cấu hình môi trường

  constructor(private http: HttpClient) {}

  getAllWebsiteContents({
    search = '',
    page = 1,
    limit = 10,
    sort = 'createdAt',
    order = 'desc',
    status,
  }: WebsiteContentFilter): Observable<WebsiteContentResponse> {
    let params = new HttpParams()
      .set('search', search)
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sort', sort)
      .set('order', order);
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<WebsiteContentResponse>(this.baseUrl, { params });
  }

  getWebsiteContentById(id: string): Observable<WebsiteContentDetailResponse> {
    return this.http.get<WebsiteContentDetailResponse>(`${this.baseUrl}/${id}`);
  }

  createWebsiteContent(
    data: FormData | WebsiteContentRequest
  ): Observable<WebsiteContentDetailResponse> {
    return this.http.post<WebsiteContentDetailResponse>(this.baseUrl, data);
  }

  toggleWebsiteContentStatus(
    id: string
  ): Observable<WebsiteContentDetailResponse> {
    return this.http.put<WebsiteContentDetailResponse>(
      `${this.baseUrl}/toggle/${id}`,
      {}
    );
  }

  updateWebsiteContent(
    id: string,
    data: FormData | WebsiteContentRequest
  ): Observable<WebsiteContentDetailResponse> {
    return this.http.put<WebsiteContentDetailResponse>(
      `${this.baseUrl}/${id}`,
      data
    );
  }

  deleteWebsiteContent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
