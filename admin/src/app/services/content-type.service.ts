// services/content-type.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContentType, ContentTypeResponse } from '../models/content-type';



@Injectable({
  providedIn: 'root',
})
export class ContentTypeService {
  private apiUrl = 'http://127.0.0.1:8000/v1/content-type';

  constructor(private http: HttpClient) {}

getAll(): Observable<ContentTypeResponse> {
  return this.http.get<ContentTypeResponse>(this.apiUrl);
}


  add(contentType: Partial<ContentType>): Observable<any> {
    return this.http.post(this.apiUrl, contentType);
  }

 updateContent(id: string, data: FormData) {
  return this.http.put(`/v1/content/${id}`, data);
}


  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
