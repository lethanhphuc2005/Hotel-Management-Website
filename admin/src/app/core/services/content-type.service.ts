// services/content-type.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContentType, ContentTypeResponse } from '../../types/content-type';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class ContentTypeService {
  private readonly baseUrl = `${environment.apiUrl}/content-type`; // Lấy URL từ file cấu hình môi trường

  constructor(private http: HttpClient) { }

  getAll(): Observable<ContentTypeResponse> {
    return this.http.get<ContentTypeResponse>(this.baseUrl);
  }


  create(data: any) {
    return this.http.post(this.baseUrl, data);
  }

  update(id: string, data: any) {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
