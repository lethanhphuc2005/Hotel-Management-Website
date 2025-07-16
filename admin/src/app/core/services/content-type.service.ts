// services/content-type.service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ContentType,
  ContentTypeDetailResponse,
  ContentTypeFilter,
  ContentTypeRequest,
  ContentTypeResponse,
} from '@/types/content-type';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class ContentTypeService {
  private readonly baseUrl = `${environment.apiUrl}/content-type`; // Lấy URL từ file cấu hình môi trường

  constructor(private http: HttpClient) {}

  getAllContentTypes({
    search = '',
    page = 1,
    limit = 10,
    sort = 'createdAt',
    order = 'desc',
    status,
  }: ContentTypeFilter): Observable<ContentTypeResponse> {
    let params = new HttpParams()
      .set('search', search)
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sort', sort)
      .set('order', order);
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<ContentTypeResponse>(this.baseUrl, { params });
  }

  getContentTypeById(id: string): Observable<ContentTypeDetailResponse> {
    return this.http.get<ContentTypeDetailResponse>(`${this.baseUrl}/${id}`);
  }

  createContentType(
    data: FormData | ContentTypeRequest
  ): Observable<ContentTypeDetailResponse> {
    return this.http.post<ContentTypeDetailResponse>(this.baseUrl, data);
  }

  toggleContentTypeStatus(id: string): Observable<ContentTypeDetailResponse> {
    return this.http.put<ContentTypeDetailResponse>(
      `${this.baseUrl}/toggle/${id}`,
      {}
    );
  }

  updateContentType(
    id: string,
    data: FormData | ContentTypeRequest
  ): Observable<ContentTypeDetailResponse> {
    return this.http.put<ContentTypeDetailResponse>(
      `${this.baseUrl}/${id}`,
      data
    );
  }

  deleteContentType(id: string): Observable<ContentTypeDetailResponse> {
    return this.http.delete<ContentTypeDetailResponse>(`${this.baseUrl}/${id}`);
  }
}
