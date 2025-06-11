// services/content-type.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContentType } from '../models/content-type';


@Injectable({
  providedIn: 'root',
})
export class ContentTypeService {
  private apiUrl = 'http://127.0.0.1:8000/v1/content-type';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ContentType[]> {
    return this.http.get<ContentType[]>(this.apiUrl);
  }

  add(contentType: Partial<ContentType>): Observable<any> {
    return this.http.post(this.apiUrl, contentType);
  }

  update(id: string, contentType: Partial<ContentType>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, contentType);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
